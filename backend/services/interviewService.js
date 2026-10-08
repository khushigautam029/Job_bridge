import { Op } from "sequelize";

import {
    Application,
    ApplicationStatusHistory,
    CandidateProfile,
    Company,
    Interview,
    Job,
    RecruiterProfile,
    User,
} from "../models/index.js";

import createNotification from "../utils/createNotification.js";
import { STATUS_CODES } from "../utils/setConstants.js";


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
            "Recruiter profile not found"
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
            "Application not found"
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
            "You are not authorized to schedule an interview for this application"
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
            "Interview date must be a valid future date"
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
            "Invalid interview type"
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
            "Candidate profile not found"
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
            "Recruiter profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    return Interview.findAll({
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

                        include: [
                            {
                                model: User,
                                as: "user",

                                attributes: [
                                    "id",
                                    "name",
                                    "email",
                                    "phone",
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

                                include: [
                                    {
                                        model: User,
                                        as: "user",

                                        attributes: [
                                            "id",
                                            "name",
                                            "email",
                                            "phone",
                                        ],
                                    },
                                ],
                            },

                            {
                                model: Job,
                                as: "job",
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
            "Interview not found"
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


    return interview;
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
            "Recruiter profile not found"
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
            "Interview not found"
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
            "Recruiter profile not found"
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
            "Interview not found"
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
            "Interview not found"
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

