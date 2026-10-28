import { randomUUID } from "node:crypto";
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
import { sendInterviewInvitationEmail } from "../utils/emailService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

// Interviews are scheduled for 45 minutes in the UI. Once that window passes,
// close any still-open record so it cannot keep a stale Join action or block
// scheduling another interview for the same application.
const INTERVIEW_DURATION_MS = 45 * 60 * 1000;
const completeExpiredInterviews = async (applicationId = null) => {
    const cutoff = new Date(Date.now() - INTERVIEW_DURATION_MS);
    await Interview.update(
        { status: "COMPLETED" },
        {
            where: {
                ...(applicationId ? { applicationId } : {}),
                status: { [Op.in]: ["SCHEDULED", "RESCHEDULED"] },
                scheduledAt: { [Op.lte]: cutoff },
            },
        }
    );
};

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

    await completeExpiredInterviews(application.id);


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

    const meetingLink =
        data.interviewType === "ONLINE"
            ? (
                data.meetingLink?.trim() ||
                `https://meet.jit.si/jobbridge-${randomUUID()}`
            )
            : null;

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

            meetingLink,

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
    if (application.status !== "INTERVIEW") {
        application.status = "INTERVIEW";
        await application.save();
        await ApplicationStatusHistory.create({
            applicationId: application.id,
            status: "INTERVIEW",
            changedBy: userId,
        });
    }

    if (
        interview.interviewType === "ONLINE" &&
        interview.meetingLink
    ) {
        try {
            const candidateUser = await User.findByPk(
                application.candidate.userId,
                {
                    attributes: ["id", "name", "email"],
                }
            );
            const recruiterUser = await User.findByPk(
                userId,
                {
                    attributes: ["name"],
                }
            );
            if (!candidateUser?.email) {
                throw new Error(
                    "Candidate email address was not found."
                );
            }
            const scheduledDate = new Date(
                interview.scheduledAt
            );

            await sendInterviewInvitationEmail({
                email: candidateUser.email,
                name: candidateUser.name,
                jobTitle: application.job.title,
                interviewDate: scheduledDate.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Asia/Kolkata",
                    }
                ),
                interviewTime: scheduledDate.toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Kolkata",
                    }
                ),
                meetingLink: interview.meetingLink,
                interviewType: interview.interviewType,
                recruiterName: recruiterUser?.name,
            });
            console.log("Interview invitation email sent successfully");
        } catch (emailError) {
            console.error(
                "Interview invitation email failed:",
                emailError.message
            );
        }
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

    const candidateApplications = await Application.findAll({
        where: { candidateId: candidate.id },
        attributes: ["id"],
    });
    await completeExpiredInterviews(candidateApplications.map(({ id }) => id));


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

    const recruiterApplications = await Application.findAll({
        attributes: ["id"],
        include: [{
            model: Job,
            as: "job",
            attributes: [],
            where: { recruiterId: recruiter.id },
        }],
    });
    const recruiterApplicationIds = recruiterApplications.map(
        ({ id }) => id
    );
    await completeExpiredInterviews(recruiterApplicationIds);


    const interviews = await Interview.findAll({
        where: {
            applicationId: {
                [Op.in]: recruiterApplicationIds,
            },
        },
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
        await completeExpiredInterviews(interview.applicationId);
        await interview.reload();
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

    await completeExpiredInterviews(interview.applicationId);
    await interview.reload();


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
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }

    await completeExpiredInterviews(interview.applicationId);
    await interview.reload();

    if (["COMPLETED", "CANCELLED"].includes(interview.status)) {
        const error = new Error("Completed or cancelled interviews cannot be rescheduled");
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    const oldScheduledAt = interview.scheduledAt
        ? new Date(interview.scheduledAt).getTime()
        : null;

    const oldInterviewType = interview.interviewType;
    const oldMeetingLink = interview.meetingLink;

    if (data.scheduledAt) {
        const scheduledDate = new Date(data.scheduledAt);
        if (
            Number.isNaN(scheduledDate.getTime()) ||
            scheduledDate <= new Date()
        ) {
            const error = new Error(
                "Interview date must be a valid future date."
            );
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        data.scheduledAt = scheduledDate;
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
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
    }


    const interviewType =
        data.interviewType ||
        interview.interviewType;

    if (interviewType === "ONLINE") {
        const providedLink = data.meetingLink?.trim();

        if (providedLink) {
            data.meetingLink = providedLink;
        } else if (
            interview.interviewType !== "ONLINE" ||
            !interview.meetingLink
        ) {
            data.meetingLink =
                `https://meet.jit.si/jobbridge-${randomUUID()}`;
        }
    }

    // OFFLINE requires location
    if (
        interviewType === "OFFLINE" &&
        !(
            data.location ??
            interview.location
        )?.trim()
    ) {
        const error = new Error("Location is required for offline interviews");
        error.statusCode = STATUS_CODES.BAD_REQUEST;
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

    //Determine whether the invitaion details changed
    const newScheduledAt = data.scheduledAt
        ? new Date(data.scheduledAt).getTime()
        : oldScheduledAt;

    const newMeetingLink =
        data.meetingLink !== undefined
            ? data.meetingLink
            : interview.meetingLink;

    const newInterviewType = data.interviewType || interview.interviewType;

    const invitationChanged =
        oldScheduledAt !== newScheduledAt ||
        oldMeetingLink !== newMeetingLink ||
        oldInterviewType !== newInterviewType;

    await interview.update(data);

    if (
        invitationChanged && interview.interviewType === "ONLINE" &&
        interview.meetingLink
    ) {
        try {
            const candidate = await CandidateProfile.findByPk(
                interview.application.candidateId
            );
            if (candidate) {
                const candidateUser = await User.findByPk(
                    candidate.userId
                );

                const recruiterUser = await User.findByPk(
                    userId
                );

                if (candidateUser?.email) {
                    const scheduledDate = new Date(
                        interview.scheduledAt
                    );

                    const interviewDate =
                        scheduledDate.toLocaleDateString(
                            "en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "Asia/Kolkata",
                        }
                    );
                    const interviewTime =
                        scheduledDate.toLocaleDateString(
                            "en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Kolkata",
                        }
                    );
                    await sendInterviewInvitationEmail({
                        email:candidateUser.email,
                        name:candidateUser.name,
                        jobTitle:interview.application.job.title,
                        interviewDate,
                        interviewTime,
                        meetingLink:interview.meetingLink,
                        interviewType:"Online",
                        recruiterName:recruiterUser?.name||"Recruiter",
                        isRescheduled:true,
                    });
                }
            }
        } catch (emailError) {
            console.error(
                "Failed to send the updated interview invitation:",
                emailError.message
            );
        }
    }
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

    await completeExpiredInterviews(interview.applicationId);
    await interview.reload();

    if (["COMPLETED", "CANCELLED"].includes(interview.status) && status !== interview.status) {
        const error = new Error("Completed or cancelled interviews cannot be changed");
        error.statusCode = STATUS_CODES.BAD_REQUEST;
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
