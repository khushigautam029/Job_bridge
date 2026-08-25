import {
    Company,
    Job,
    JobCategory,
    RecruiterProfile,
} from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";


const getRecruiterProfile = async (userId) => {

    const recruiterProfile =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiterProfile) {
        const error = new Error(
            "Recruiter profile not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return recruiterProfile;
};


const createJob = async (
    userId,
    data
) => {

    const recruiterProfile =
        await getRecruiterProfile(userId);

    const category =
        await JobCategory.findByPk(
            data.categoryId
        );

    if (!category) {
        const error = new Error(
            "Job category not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    const job = await Job.create({
        recruiterId: recruiterProfile.id,
        companyId: recruiterProfile.companyId,
        ...data,
    });

    return getJobById(job.id);
};


const getAllJobs = async () => {

    const jobs = await Job.findAll({
        include: [
            {
                model: Company,
                as: "company",
                attributes: [
                    "id",
                    "name",
                    "logo",
                    "website",
                    "location",
                ],
            },
            {
                model: JobCategory,
                as: "category",
                attributes: [
                    "id",
                    "name",
                ],
            },
        ],
        where: {
            status: "OPEN",
        },
        order: [
            ["createdAt", "DESC"],
        ],
    });

    return jobs;
};


const getJobById = async (
    jobId
) => {

    const job = await Job.findByPk(
        jobId,
        {
            include: [
                {
                    model: Company,
                    as: "company",
                },
                {
                    model: JobCategory,
                    as: "category",
                },
                {
                    model: RecruiterProfile,
                    as: "recruiter",
                },
            ],
        }
    );

    if (!job) {
        const error = new Error(
            "Job not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return job;
};


const updateJob = async (
    userId,
    jobId,
    data
) => {

    const recruiterProfile =
        await getRecruiterProfile(userId);

    const job = await Job.findByPk(
        jobId
    );

    if (!job) {
        const error = new Error(
            "Job not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    if (
        job.recruiterId !==
        recruiterProfile.id
    ) {
        const error = new Error(
            "You are not allowed to update this job"
        );

        error.statusCode = STATUS_CODES.FORBIDDEN;

        throw error;
    }

    if (data.categoryId) {

        const category =
            await JobCategory.findByPk(
                data.categoryId
            );

        if (!category) {
            const error = new Error(
                "Job category not found"
            );

            error.statusCode = STATUS_CODES.NOT_FOUND;

            throw error;
        }
    }

    await job.update(data);

    return getJobById(job.id);
};


const deleteJob = async (
    userId,
    jobId
) => {

    const recruiterProfile =
        await getRecruiterProfile(userId);

    const job = await Job.findByPk(
        jobId
    );

    if (!job) {
        const error = new Error(
            "Job not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    if (
        job.recruiterId !==
        recruiterProfile.id
    ) {
        const error = new Error(
            "You are not allowed to delete this job"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    await job.destroy();
};


export {
    createJob, deleteJob, getAllJobs,
    getJobById,
    updateJob
};
