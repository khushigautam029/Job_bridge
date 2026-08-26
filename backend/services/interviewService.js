import {
    Application,
    CandidateProfile,
    Interview,
    Job,
    RecruiterProfile,
    User,
} from "../models/index.js";
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
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
                ],
            }
        );


    if (!application) {
        const error = new Error(
            "Application not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
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

        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }


    // Only shortlisted/interview candidates
    // should normally get an interview
    if (
        ![
            "SHORTLISTED",
            "INTERVIEW",
        ].includes(application.status)
    ) {

        const error = new Error(
            "Candidate must be shortlisted before scheduling an interview"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    // Check interview date
    if (
        new Date(data.scheduledAt) <=
        new Date()
    ) {

        const error = new Error(
            "Interview date must be in the future"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    // ONLINE interview should have meeting link
    if (
        data.interviewType === "ONLINE" &&
        !data.meetingLink
    ) {

        const error = new Error(
            "Meeting link is required for online interviews"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    // OFFLINE interview should have location
    if (
        data.interviewType === "OFFLINE" &&
        !data.location
    ) {

        const error = new Error(
            "Location is required for offline interviews"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    const interview =
        await Interview.create({

            applicationId:
                application.id,

            scheduledBy:
                userId,

            scheduledAt:
                data.scheduledAt,

            interviewType:
                data.interviewType,

            meetingLink:
                data.meetingLink || null,

            location:
                data.location || null,

            notes:
                data.notes || null,

        });


    // Update application status
    if (
        application.status !==
        "INTERVIEW"
    ) {

        application.status =
            "INTERVIEW";

        await application.save();
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
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
                        },
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    /*
        Check candidate ownership
        or recruiter ownership
    */

    const candidate =
        interview.application.candidate;

    if (
        candidate.userId === userId
    ) {
        return interview;
    }


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

        error.statusCode = STATUS_CODES.FORBIDDEN;
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
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


    if (
        data.scheduledAt &&
        new Date(data.scheduledAt) <=
        new Date()
    ) {

        const error = new Error(
            "Interview date must be in the future"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    if (
        data.interviewType ===
        "ONLINE" &&
        data.meetingLink === ""
    ) {

        const error = new Error(
            "Meeting link is required for online interviews"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
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


    interview.status = status;

    await interview.save();


    return interview;
};


/*
    Recruiter deletes/cancels interview
*/
const cancelInterview = async (
    userId,
    interviewId
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
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

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    if (
        interview.application.job.recruiterId !==
        recruiter.id
    ) {

        const error = new Error(
            "You are not authorized to cancel this interview"
        );

        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }


    interview.status = "CANCELLED";

    await interview.save();


    return interview;
};


export {
    cancelInterview, getInterviewById, getMyInterviews, scheduleInterview, updateInterview,
    updateInterviewStatus
};
