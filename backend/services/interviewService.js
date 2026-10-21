import { Op } from "sequelize";

import {
    Application,
    ApplicationStatusHistory,
    CandidateEducation,
    CandidateExperience,
    CandidateProfile,
    CandidateProject,
    Company,
    Interview,
    Job,
    JobCategory,
    RecruiterProfile,
    Skill,
    User,
    UserPreference,
} from "../models/index.js";

import createNotification from "../utils/createNotification.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

const applyCandidatePrivacyToInterviews = async (interviews) => {
    const isList = Array.isArray(interviews);
    const rows = (isList ? interviews : [interviews]).map((interview) =>
        interview?.toJSON ? interview.toJSON() : interview
    );
    const userIds = rows
        .map((interview) => interview?.application?.candidate?.user?.id)
        .filter(Boolean);

    if (!userIds.length) return isList ? rows : rows[0];

    const preferences = await UserPreference.findAll({
        where: { userId: [...new Set(userIds)] },
    });
    const preferencesByUserId = new Map(
        preferences.map((preference) => [preference.userId, preference])
    );

    const sanitizedRows = rows.map((interview) => {
        const application = interview?.application;
        const candidate = application?.candidate;
        if (!candidate) return interview;

        const settings = preferencesByUserId.get(candidate.user?.id);
        if (settings?.privacySettings?.profileVisibility === false) {
            candidate.bio = null;
            candidate.location = null;
            candidate.experienceYears = null;
            candidate.linkedinUrl = null;
            candidate.githubUrl = null;
            candidate.portfolioUrl = null;
            candidate.skills = [];
            candidate.educations = [];
            candidate.experiences = [];
            candidate.projects = [];
            if (candidate.user) {
                candidate.user.name = "Candidate";
                candidate.user.email = null;
                candidate.user.phone = null;
            }
        }
        if (settings?.privacySettings?.resumeVisibility === false) {
            candidate.resume = null;
            application.resume = null;
        }
        return interview;
    });

    return isList ? sanitizedRows : sanitizedRows[0];
};

const candidateProfileIncludes = [
    {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "phone"],
    },
    {
        model: Skill,
        as: "skills",
        attributes: ["id", "name"],
        through: { attributes: [] },
    },
    { model: CandidateEducation, as: "educations" },
    { model: CandidateExperience, as: "experiences" },
    { model: CandidateProject, as: "projects" },
];


/*
    Recruiter schedules an interview
*/
const scheduleInterview = async (
    userId,
    applicationId,
    data
) => {

    // Find recruiter
    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    // Find application
    const application =
        await Application.findByPk(
            applicationId,
            {
                include: [
                    {
                        model: Job,
                        as: "job",
                    },
                    {
                        model: CandidateProfile,
                        as: "candidate",
                    },
                ],
            }
        );

    if (!application) {
        const error = new Error(
            MESSAGES.APPLICATION_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    // Make sure recruiter owns the job
    if (
        application.job.recruiterId !==
        recruiter.id
    ) {
        const error = new Error(
           MESSAGES.YOU_ARE_UNAUTHORIZED_TO_SCHEDULE_AN_INTERVIEW
        );

        error.statusCode =
            STATUS_CODES.FORBIDDEN;

        throw error;
    }


    // Candidate must be shortlisted first
    if (
        ![
            "SHORTLISTED",
            "INTERVIEW",
        ].includes(application.status)
    ) {
        const error = new Error(
            "Candidate must be shortlisted before scheduling an interview"
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    // Check interview date
    const scheduledDate =
        new Date(data.scheduledAt);

    if (
        Number.isNaN(scheduledDate.getTime()) ||
        scheduledDate <= new Date()
    ) {
        const error = new Error(
            MESSAGES.INTERVIEW_DATE_MUST_BE_VALID
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    // Validate interview type
    const allowedInterviewTypes = [
        "ONLINE",
        "OFFLINE",
        "PHONE",
    ];

    if (
        !allowedInterviewTypes.includes(
            data.interviewType
        )
    ) {
        const error = new Error(
           MESSAGES.INVALID_INTERVIEW_TYPE
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    // ONLINE interview requires meeting link
    if (
        data.interviewType === "ONLINE" &&
        !data.meetingLink?.trim()
    ) {
        const error = new Error(
            "Meeting link is required for online interviews"
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    // OFFLINE interview requires location
    if (
        data.interviewType === "OFFLINE" &&
        !data.location?.trim()
    ) {
        const error = new Error(
            "Location is required for offline interviews"
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    // Prevent duplicate active interviews
    const existingInterview =
        await Interview.findOne({
            where: {
                applicationId: application.id,
                status: {
                    [Op.in]: [
                        "SCHEDULED",
                        "RESCHEDULED",
                    ],
                },
            },
        });

    if (existingInterview) {
        const error = new Error(
            "An active interview is already scheduled for this application"
        );

        error.statusCode =
            STATUS_CODES.CONFLICT;

        throw error;
    }


    // Create interview
    const interview =
        await Interview.create({
            applicationId:
                application.id,

            scheduledBy:
                userId,

            scheduledAt:
                scheduledDate,

            interviewType:
                data.interviewType,

            meetingLink:
                data.meetingLink?.trim() ||
                null,

            location:
                data.location?.trim() ||
                null,

            notes:
                data.notes?.trim() ||
                null,

            status: "SCHEDULED",
        });


    // Create candidate notification
    await createNotification({
        userId:
            application.candidate.userId,

        title:
            "Interview Scheduled",

        message:
            `Your interview for "${application.job.title}" has been scheduled.`,

        type:
            "INTERVIEW",
    });


    // Update application status
    if (
        application.status !==
        "INTERVIEW"
    ) {
        application.status =
            "INTERVIEW";

        await application.save();

        await ApplicationStatusHistory.create({
            applicationId:
                application.id,

            status:
                "INTERVIEW",

            changedBy:
                userId,
        });
    }


    return interview;
};


/*
    Candidate gets their interviews
*/
const getMyInterviews = async (
    userId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidate) {
        const error = new Error(
            MESSAGES.PROFILE_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const interviews =
        await Interview.findAll({
            include: [
                {
                    model: Application,
                    as: "application",

                    where: {
                        candidateId:
                            candidate.id,
                    },

                    include: [
                        {
                            model: Job,
                            as: "job",

                            include: [
                                {
                                    model: Company,
                                    as: "company",

                                    attributes: [
                                        "id",
                                        "name",
                                        "location",
                                    ],
                                },
                            ],
                        },
                    ],
                },

                {
                    model: User,
                    as: "scheduler",

                    attributes: [
                        "id",
                        "name",
                        "email",
                    ],
                },
            ],

            order: [
                ["scheduledAt", "ASC"],
            ],
        });


    return interviews;
};


/*
    Recruiter gets their interviews
*/
const getRecruiterInterviews = async (
    userId
) => {

    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const interviews = await Interview.findAll({
        include: [
            {
                model: Application,
                as: "application",

                include: [
                    {
                        model: Job,
                        as: "job",

                        where: {
                            recruiterId:
                                recruiter.id,
                        },

                        include: [
                            {
                                model: JobCategory,
                                as: "category",
                                attributes: ["id", "name"],
                            },
                            {
                                model: Company,
                                as: "company",

                                attributes: [
                                    "id",
                                    "name",
                                    "location",
                                ],
                            },
                        ],
                    },

                    {
                        model: CandidateProfile,
                        as: "candidate",
                        include: candidateProfileIncludes,
                    },
                ],
            },

            {
                model: User,
                as: "scheduler",

                attributes: [
                    "id",
                    "name",
                    "email",
                ],
            },
        ],

        order: [
            ["scheduledAt", "ASC"],
        ],
    });

    return applyCandidatePrivacyToInterviews(interviews);
};


/*
    Get one interview
*/
const getInterviewById = async (
    userId,
    interviewId
) => {

    const interview =
        await Interview.findByPk(
            interviewId,
            {
                include: [
                    {
                        model: Application,
                        as: "application",

                        include: [
                            {
                                model: CandidateProfile,
                                as: "candidate",
                                include: candidateProfileIncludes,
                            },

                            {
                                model: Job,
                                as: "job",
                                include: [
                                    {
                                        model: JobCategory,
                                        as: "category",
                                        attributes: ["id", "name"],
                                    },
                                    {
                                        model: Company,
                                        as: "company",
                                        attributes: ["id", "name", "location"],
                                    },
                                ],
                            },
                        ],
                    },

                    {
                        model: User,
                        as: "scheduler",

                        attributes: [
                            "id",
                            "name",
                            "email",
                        ],
                    },
                ],
            }
        );


    if (!interview) {
        const error = new Error(
            MESSAGES.INTERVIEW_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    // Candidate ownership
    const candidate =
        interview.application.candidate;

    if (
        candidate.userId === userId
    ) {
        return interview;
    }


    // Recruiter ownership
    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });


    if (
        !recruiter ||
        interview.application.job.recruiterId !==
        recruiter.id
    ) {
        const error = new Error(
            "You are not authorized to view this interview"
        );

        error.statusCode =
            STATUS_CODES.FORBIDDEN;

        throw error;
    }


    return applyCandidatePrivacyToInterviews(interview);
};


/*
    Recruiter updates interview details
*/
const updateInterview = async (
    userId,
    interviewId,
    data
) => {

    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const interview =
        await Interview.findByPk(
            interviewId,
            {
                include: [
                    {
                        model: Application,
                        as: "application",

                        include: [
                            {
                                model: Job,
                                as: "job",
                            },
                        ],
                    },
                ],
            }
        );


    if (!interview) {
        const error = new Error(
            MESSAGES.INTERVIEW_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    if (
        interview.application.job.recruiterId !==
        recruiter.id
    ) {
        const error = new Error(
            "You are not authorized to update this interview"
        );

        error.statusCode =
            STATUS_CODES.FORBIDDEN;

        throw error;
    }


    // Validate updated date
    if (data.scheduledAt) {
        const scheduledDate =
            new Date(data.scheduledAt);

        if (
            Number.isNaN(
                scheduledDate.getTime()
            ) ||
            scheduledDate <= new Date()
        ) {
            const error = new Error(
                "Interview date must be a valid future date"
            );

            error.statusCode =
                STATUS_CODES.BAD_REQUEST;

            throw error;
        }

        data.scheduledAt =
            scheduledDate;
    }


    // Validate interview type
    if (data.interviewType) {
        const allowedInterviewTypes = [
            "ONLINE",
            "OFFLINE",
            "PHONE",
        ];

        if (
            !allowedInterviewTypes.includes(
                data.interviewType
            )
        ) {
            const error = new Error(
                "Invalid interview type"
            );

            error.statusCode =
                STATUS_CODES.BAD_REQUEST;

            throw error;
        }
    }


    const interviewType =
        data.interviewType ||
        interview.interviewType;


    // ONLINE requires meeting link
    if (
        interviewType === "ONLINE" &&
        !(
            data.meetingLink ??
            interview.meetingLink
        )?.trim()
    ) {
        const error = new Error(
            "Meeting link is required for online interviews"
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    // OFFLINE requires location
    if (
        interviewType === "OFFLINE" &&
        !(
            data.location ??
            interview.location
        )?.trim()
    ) {
        const error = new Error(
            "Location is required for offline interviews"
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    if (data.meetingLink !== undefined) {
        data.meetingLink =
            data.meetingLink?.trim() || null;
    }

    if (data.location !== undefined) {
        data.location =
            data.location?.trim() || null;
    }

    if (data.notes !== undefined) {
        data.notes =
            data.notes?.trim() || null;
    }


    await interview.update(data);

    return interview;
};


/*
    Recruiter updates interview status
*/
const updateInterviewStatus = async (
    userId,
    interviewId,
    status
) => {

    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const interview =
        await Interview.findByPk(
            interviewId,
            {
                include: [
                    {
                        model: Application,
                        as: "application",

                        include: [
                            {
                                model: Job,
                                as: "job",
                            },
                        ],
                    },
                ],
            }
        );


    if (!interview) {
        const error = new Error(
            MESSAGES.INTERVIEW_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    if (
        interview.application.job.recruiterId !==
        recruiter.id
    ) {
        const error = new Error(
            "You are not authorized to update this interview"
        );

        error.statusCode =
            STATUS_CODES.FORBIDDEN;

        throw error;
    }


    const allowedStatuses = [
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
    ];

    if (!allowedStatuses.includes(status)) {
        const error = new Error(
            "Invalid interview status"
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    interview.status = status;

    await interview.save();

    return interview;
};


/*
    Recruiter / Candidate cancels interview
*/
const cancelInterview = async (
    userId,
    interviewId
) => {

    const interview =
        await Interview.findByPk(
            interviewId,
            {
                include: [
                    {
                        model: Application,
                        as: "application",

                        include: [
                            {
                                model: Job,
                                as: "job",
                            },
                            {
                                model: CandidateProfile,
                                as: "candidate",
                            },
                        ],
                    },
                ],
            }
        );


    if (!interview) {
        const error = new Error(
            MESSAGES.INTERVIEW_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const candidateOwnsInterview =
        interview.application.candidate.userId ===
        userId;


    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });


    const recruiterOwnsInterview =
        recruiter &&
        interview.application.job.recruiterId ===
            recruiter.id;


    if (
        !candidateOwnsInterview &&
        !recruiterOwnsInterview
    ) {
        const error = new Error(
            "You are not authorized to cancel this interview"
        );

        error.statusCode =
            STATUS_CODES.FORBIDDEN;

        throw error;
    }


    interview.status =
        "CANCELLED";

    await interview.save();

    return interview;
};


export {
    cancelInterview,
    getInterviewById,
    getMyInterviews,
    getRecruiterInterviews,
    scheduleInterview,
    updateInterview,
    updateInterviewStatus
};

