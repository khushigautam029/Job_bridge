import {
    Application,
    ApplicationStatusHistory,
    CandidateProfile,
    Job,
    RecruiterProfile,
    User,
} from "../models/index.js";
import createNotification from "../utils/createNotification.js";
import { STATUS_CODES } from "../utils/setConstants.js";

/*
    Candidate applies for a job
*/
const applyForJob = async (
    userId,
    jobId,
    data
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


    const job = await Job.findByPk(jobId);

    if (!job) {
        const error = new Error(
            "Job not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    if (job.status !== "OPEN") {
        const error = new Error(
            "This job is not open for applications"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    if (
        job.applicationDeadline &&
        new Date(job.applicationDeadline) <
        new Date()
    ) {
        const error = new Error(
            "Application deadline has passed"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    const existingApplication =
        await Application.findOne({
            where: {
                jobId,
                candidateId: candidate.id,
            },
        });


    if (existingApplication) {

        if (
            existingApplication.status ===
            "WITHDRAWN"
        ) {

            await existingApplication.update({
                ...data,
                status: "APPLIED",
                appliedAt: new Date(),
            });

            return existingApplication;
        }


        const error = new Error(
            "You have already applied for this job"
        );

        error.statusCode = STATUS_CODES.CONFLICT;
        throw error;
    }


    const application =
        await Application.create({
            jobId,
            candidateId: candidate.id,
            resume: data.resume || null,
            coverLetter: data.coverLetter || null,
            expectedSalary:
                data.expectedSalary || null,
            noticePeriod:
                data.noticePeriod || null,
        });


    // Create initial status history
    await ApplicationStatusHistory.create({
        applicationId: application.id,
        status: "APPLIED",
        changedBy: userId,
    });


    // Find recruiter who owns this job
    const recruiter =
        await RecruiterProfile.findByPk(
            job.recruiterId
        );


    if (recruiter) {

        await createNotification({
            userId: recruiter.userId,
            title: "New Job Application",
            message: `A candidate has applied for your job: ${job.title}`,
            type: "APPLICATION",
        });
    }


    return application;
};

// Candidate gets all of their applications
const getMyApplications = async (
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


    const applications =
        await Application.findAll({

            where: {
                candidateId: candidate.id,
            },

            include: [
                {
                    model: Job,
                    as: "job",
                    attributes: [
                        "id",
                        "title",
                        "location",
                        "jobType",
                        "workMode",
                        "minSalary",
                        "maxSalary",
                        "status",
                    ],
                },
            ],

            order: [
                ["appliedAt", "DESC"],
            ],
        });


    return applications;
};


/*
    Get one application
*/
const getApplicationById = async (
    userId,
    applicationId
) => {

    const application =
        await Application.findByPk(
            applicationId,
            {
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

                        include: [
                            {
                                model: RecruiterProfile,
                                as: "recruiter",
                            },
                        ],
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


    /*
        Check whether the logged-in user
        is the candidate who applied.
    */

    if (
        application.candidate.userId !==
        userId
    ) {

        const recruiterProfile =
            await RecruiterProfile.findOne({
                where: {
                    userId,
                },
            });


        if (
            !recruiterProfile ||
            application.job.recruiterId !==
            recruiterProfile.id
        ) {

            const error = new Error(
                "You are not authorized to view this application"
            );

            error.statusCode = STATUS_CODES.FORBIDDEN;
            throw error;
        }
    }


    return application;
};


/*
    Candidate withdraws application
*/
const withdrawApplication = async (
    userId,
    applicationId
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


    const application =
        await Application.findOne({
            where: {
                id: applicationId,
                candidateId: candidate.id,
            },
        });


    if (!application) {
        const error = new Error(
            "Application not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    if (
        [
            "SELECTED",
            "REJECTED",
        ].includes(application.status)
    ) {

        const error = new Error(
            "This application cannot be withdrawn"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    application.status = "WITHDRAWN";

    await application.save();

    await ApplicationStatusHistory.create({
        applicationId: application.id,
        status: "WITHDRAWN",
        changedBy: userId,
    });


    return application;
};


/*
    Recruiter gets applications
    for their job
*/
const getJobApplications = async (
    userId,
    jobId
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


    const job = await Job.findOne({
        where: {
            id: jobId,
            recruiterId: recruiter.id,
        },
    });


    if (!job) {
        const error = new Error(
            "Job not found or you are not authorized"
        );

        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }


    const applications =
        await Application.findAll({

            where: {
                jobId,
            },

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
            ],

            order: [
                ["appliedAt", "DESC"],
            ],
        });


    return applications;
};


/*
    Recruiter changes application status
*/
const updateApplicationStatus = async (
    userId,
    applicationId,
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


    if (
        application.job.recruiterId !==
        recruiter.id
    ) {
        const error = new Error(
            "You are not authorized to update this application"
        );

        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }


    if (
        application.status === "WITHDRAWN"
    ) {
        const error = new Error(
            "Withdrawn applications cannot be updated"
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    // Update application status
    application.status = status;

    await application.save();


    // Create status history
    await ApplicationStatusHistory.create({
        applicationId: application.id,
        status: status,
        changedBy: userId,
    });

    const candidate =
        await CandidateProfile.findByPk(
            application.candidateId
        );

    if (candidate) {

        await createNotification({
            userId: candidate.userId,
            title: "Application Status Updated",
            message: `Your application for "${application.job.title}" has been moved to ${status}.`,
            type: "APPLICATION",
        });
    }


    return application;
};


export {
    applyForJob, getApplicationById, getJobApplications, getMyApplications, updateApplicationStatus, withdrawApplication
};
