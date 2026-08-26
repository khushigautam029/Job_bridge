import { Op } from "sequelize";

import {
    Application,
    CandidateProfile,
    Interview,
    Job,
    Notification,
    RecruiterProfile,
    SavedJob,
} from "../models/index.js";

import { STATUS_CODES } from "../utils/setConstants.js";


/*
    ================================
    CANDIDATE DASHBOARD
    ================================
*/

const getCandidateDashboard = async (userId) => {

    const candidate = await CandidateProfile.findOne({
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


    // Application statistics
    const totalApplications =
        await Application.count({
            where: {
                candidateId: candidate.id,
            },
        });


    const applied =
        await Application.count({
            where: {
                candidateId: candidate.id,
                status: "APPLIED",
            },
        });


    const underReview =
        await Application.count({
            where: {
                candidateId: candidate.id,
                status: "UNDER_REVIEW",
            },
        });


    const shortlisted =
        await Application.count({
            where: {
                candidateId: candidate.id,
                status: "SHORTLISTED",
            },
        });


    const interviews =
        await Application.count({
            where: {
                candidateId: candidate.id,
                status: "INTERVIEW",
            },
        });


    const selected =
        await Application.count({
            where: {
                candidateId: candidate.id,
                status: "SELECTED",
            },
        });


    const rejected =
        await Application.count({
            where: {
                candidateId: candidate.id,
                status: "REJECTED",
            },
        });


    // Saved jobs
    const savedJobs =
        await SavedJob.count({
            where: {
                candidateId: candidate.id,
            },
        });


    // Unread notifications
    const unreadNotifications =
        await Notification.count({
            where: {
                userId,
                isRead: false,
            },
        });


    /*
        Recent applications
    */

    const recentApplications =
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
                        "status",
                    ],
                },
            ],

            order: [
                ["appliedAt", "DESC"],
            ],

            limit: 5,
        });


    /*
        Upcoming interviews

        We first get applications
        belonging to this candidate.
    */

    const candidateApplications =
        await Application.findAll({

            where: {
                candidateId: candidate.id,
            },

            attributes: ["id"],
        });


    const applicationIds =
        candidateApplications.map(
            (application) => application.id
        );


    let upcomingInterviews = [];


    if (applicationIds.length > 0) {

        upcomingInterviews =
            await Interview.findAll({

                where: {
                    applicationId: {
                        [Op.in]: applicationIds,
                    },

                    scheduledAt: {
                        [Op.gte]: new Date(),
                    },

                    status: "SCHEDULED",
                },

                include: [
                    {
                        model: Application,
                        as: "application",

                        include: [
                            {
                                model: Job,
                                as: "job",
                                attributes: [
                                    "id",
                                    "title",
                                    "location",
                                ],
                            },
                        ],
                    },
                ],

                order: [
                    ["scheduledAt", "ASC"],
                ],

                limit: 5,
            });
    }


    return {

        statistics: {

            totalApplications,

            applied,

            underReview,

            shortlisted,

            interviews,

            selected,

            rejected,

            savedJobs,

            unreadNotifications,

        },

        recentApplications,

        upcomingInterviews,

    };
};


/*
    ================================
    RECRUITER DASHBOARD
    ================================
*/

const getRecruiterDashboard = async (userId) => {

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


    /*
        JOB STATISTICS
    */

    const totalJobs =
        await Job.count({
            where: {
                recruiterId: recruiter.id,
            },
        });


    const openJobs =
        await Job.count({
            where: {
                recruiterId: recruiter.id,
                status: "OPEN",
            },
        });


    const draftJobs =
        await Job.count({
            where: {
                recruiterId: recruiter.id,
                status: "DRAFT",
            },
        });


    const closedJobs =
        await Job.count({
            where: {
                recruiterId: recruiter.id,
                status: "CLOSED",
            },
        });


    /*
        Get recruiter jobs
    */

    const recruiterJobs =
        await Job.findAll({

            where: {
                recruiterId: recruiter.id,
            },

            attributes: ["id"],

        });


    const jobIds =
        recruiterJobs.map(
            (job) => job.id
        );


    /*
        APPLICATION STATISTICS
    */

    let totalApplications = 0;
    let underReview = 0;
    let shortlisted = 0;
    let interviews = 0;
    let selected = 0;


    if (jobIds.length > 0) {

        totalApplications =
            await Application.count({
                where: {
                    jobId: {
                        [Op.in]: jobIds,
                    },
                },
            });


        underReview =
            await Application.count({
                where: {
                    jobId: {
                        [Op.in]: jobIds,
                    },

                    status: "UNDER_REVIEW",
                },
            });


        shortlisted =
            await Application.count({
                where: {
                    jobId: {
                        [Op.in]: jobIds,
                    },

                    status: "SHORTLISTED",
                },
            });


        interviews =
            await Application.count({
                where: {
                    jobId: {
                        [Op.in]: jobIds,
                    },

                    status: "INTERVIEW",
                },
            });


        selected =
            await Application.count({
                where: {
                    jobId: {
                        [Op.in]: jobIds,
                    },

                    status: "SELECTED",
                },
            });

    }


    /*
        RECENT APPLICATIONS
    */

    let recentApplications = [];


    if (jobIds.length > 0) {

        recentApplications =
            await Application.findAll({

                where: {
                    jobId: {
                        [Op.in]: jobIds,
                    },
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
                        ],
                    },
                ],

                order: [
                    ["appliedAt", "DESC"],
                ],

                limit: 5,

            });

    }


    /*
        UPCOMING INTERVIEWS
    */

    let upcomingInterviews = [];


    if (jobIds.length > 0) {

        upcomingInterviews =
            await Interview.findAll({

                where: {
                    scheduledAt: {
                        [Op.gte]: new Date(),
                    },

                    status: "SCHEDULED",
                },

                include: [
                    {
                        model: Application,
                        as: "application",

                        where: {
                            jobId: {
                                [Op.in]: jobIds,
                            },
                        },

                        include: [
                            {
                                model: Job,
                                as: "job",
                                attributes: [
                                    "id",
                                    "title",
                                ],
                            },
                        ],
                    },
                ],

                order: [
                    ["scheduledAt", "ASC"],
                ],

                limit: 5,

            });

    }


    /*
        RECENT JOBS
    */

    const recentJobs =
        await Job.findAll({

            where: {
                recruiterId: recruiter.id,
            },

            order: [
                ["createdAt", "DESC"],
            ],

            limit: 5,

        });


    return {

        statistics: {

            totalJobs,

            openJobs,

            draftJobs,

            closedJobs,

            totalApplications,

            underReview,

            shortlisted,

            interviews,

            selected,

        },

        recentApplications,

        upcomingInterviews,

        recentJobs,

    };
};


export {
    getCandidateDashboard,
    getRecruiterDashboard
};
