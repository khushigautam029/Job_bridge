import { Op } from "sequelize";
import {
    Company,
    Job,
    JobCategory,
    RecruiterProfile,
    Skill,
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

const getAllJobs = async (filters = {}) => {
    const {
        search,
        location,
        categoryId,
        jobType,
        workMode,
        minSalary,
        maxSalary,
        experienceMin,
        experienceMax,
        sortBy = "createdAt",
        order = "DESC",
        page = 1,
        limit = 10,
    } = filters;
    const where = {
        status: "OPEN",
    };
    // Search by title, description,
    // requirements or responsibilities
    if (search) {
        where[Op.or] = [
            {
                title: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                description: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                requirements: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                responsibilities: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }
    // Location filter
    if (location) {
        where.location = {
            [Op.like]: `%${location}%`,
        };
    }
    // Category filter
    if (categoryId) {
        where.categoryId = categoryId;
    }
    // Job type filter
    if (jobType) {
        where.jobType = jobType;
    }
    // Work mode filter
    if (workMode) {
        where.workMode = workMode;
    }
    // Salary filters
    if (minSalary !== undefined) {
        where.maxSalary = {
            [Op.gte]: minSalary,
        };
    }
    if (maxSalary !== undefined) {
        where.minSalary = {
            [Op.lte]: maxSalary,
        };
    }
    // Experience filters
    if (experienceMin !== undefined) {
        where.experienceMax = {
            [Op.gte]: experienceMin,
        };
    }
    if (experienceMax !== undefined) {
        where.experienceMin = {
            [Op.lte]: experienceMax,
        };
    }
    const offset = (page - 1) * limit;
    const { count, rows } =
        await Job.findAndCountAll({
            where,
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
            order: [
                [sortBy, order],
            ],
            limit,
            offset,
            distinct: true,
        });
    return {
        jobs: rows,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(
                count / limit
            ),
            totalJobs: count,
            jobsPerPage: limit,
            hasNextPage:
                page < Math.ceil(count / limit),
            hasPreviousPage:
                page > 1,
        },
    };
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
                    attributes: [
                        "id",
                        "name",
                        "description",
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
                {
                    model: RecruiterProfile,
                    as: "recruiter",
                    attributes: [
                        "id",
                        "userId",
                        "companyId",
                        "designation",
                        "phone",
                    ],
                },
                {
                    model: Skill,
                    as: "skills",
                    attributes: [
                        "id",
                        "name",
                    ],
                    through: {
                        attributes: [],
                    },
                },
            ],
        }
    );

    if (!job) {
        const error = new Error(
            "Job not found"
        );
        error.statusCode =
            STATUS_CODES.NOT_FOUND;
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
    const job =
        await Job.findByPk(jobId);
    if (!job) {
        const error = new Error(
            "Job not found"
        );
        error.statusCode =
            STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (
        job.recruiterId !==
        recruiterProfile.id
    ) {
        const error = new Error(
            "You are not allowed to update this job"
        );
        error.statusCode =
            STATUS_CODES.FORBIDDEN;
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
            error.statusCode =
                STATUS_CODES.NOT_FOUND;
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
    const job =
        await Job.findByPk(jobId);
    if (!job) {
        const error = new Error(
            "Job not found"
        );
        error.statusCode =
            STATUS_CODES.NOT_FOUND;
        throw error;
    }
    if (
        job.recruiterId !==
        recruiterProfile.id
    ) {
        const error = new Error(
            "You are not allowed to delete this job"
        );
        error.statusCode =
            STATUS_CODES.FORBIDDEN;
        throw error;
    }
    await job.destroy();
};


export {
    createJob,
    deleteJob,
    getAllJobs,
    getJobById,
    updateJob
};
