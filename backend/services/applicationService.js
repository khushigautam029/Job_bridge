import {
    Application,
    CandidateProfile,
    Job,
    RecruiterProfile,
    User,
} from "../models/index.js";


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

        error.statusCode = 404;
        throw error;
    }


    const job = await Job.findByPk(jobId);

    if (!job) {
        const error = new Error(
            "Job not found"
        );

        error.statusCode = 404;
        throw error;
    }


    if (job.status !== "OPEN") {
        const error = new Error(
            "This job is not open for applications"
        );

        error.statusCode = 400;
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

        error.statusCode = 400;
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

        error.statusCode = 409;
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


    return application;
};


/*
    Candidate gets all of their applications
*/
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

        error.statusCode = 404;
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

        error.statusCode = 404;
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

            error.statusCode = 403;
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

        error.statusCode = 404;
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

        error.statusCode = 404;
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

        error.statusCode = 400;
        throw error;
    }


    application.status = "WITHDRAWN";

    await application.save();


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

        error.statusCode = 404;
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

        error.statusCode = 403;
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

        error.statusCode = 404;
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

        error.statusCode = 404;
        throw error;
    }


    if (
        application.job.recruiterId !==
        recruiter.id
    ) {

        const error = new Error(
            "You are not authorized to update this application"
        );

        error.statusCode = 403;
        throw error;
    }


    if (
        application.status ===
        "WITHDRAWN"
    ) {

        const error = new Error(
            "Withdrawn applications cannot be updated"
        );

        error.statusCode = 400;
        throw error;
    }


    application.status = status;

    await application.save();


    return application;
};


export {
    applyForJob, getApplicationById, getJobApplications, getMyApplications, updateApplicationStatus, withdrawApplication
};
