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

const getAllJobs = async (query) => {
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
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "DESC",
    } = query;
    const currentPage =
        Math.max(Number(page), 1);
    const pageLimit =
        Math.min(
            Math.max(Number(limit), 1),
            100
        );
    const offset =
        (currentPage - 1) * pageLimit;
    const where = {
        status: "OPEN",
    };

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
        ];
    }
    if (location) {

        where.location = {
            [Op.like]: `%${location}%`,
        };
    }
    if (categoryId) {

        where.categoryId =
            Number(categoryId);
    }
    if (jobType) {
        where.jobType = jobType;
    }
    if (workMode) {
        where.workMode = workMode;
    }
    if (minSalary) {
        where.maxSalary = {
            [Op.gte]: Number(minSalary),
        };
    }
    if (maxSalary) {
        where.minSalary = {
            [Op.lte]: Number(maxSalary),
        };
    }
    if (experienceMin) {
        where.experienceMax = {
            [Op.gte]: Number(experienceMin),
        };
    }
    if (experienceMax) {

        where.experienceMin = {
            [Op.lte]: Number(experienceMax),
        };
    }
    const allowedSortFields = [
        "createdAt",
        "title",
        "minSalary",
        "maxSalary",
        "applicationDeadline",
    ];

    const safeSortBy =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";
    const safeOrder =
        order.toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";
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
                [
                    safeSortBy,
                    safeOrder,
                ],
            ],
            limit: pageLimit,
            offset,
        });
    const totalPages =
        Math.ceil(
            count / pageLimit
        );
    return {
        jobs: rows,
        pagination: {
            totalJobs: count,
            currentPage,
            totalPages,
            limit: pageLimit,
            hasNextPage:
                currentPage < totalPages,
            hasPreviousPage:
                currentPage > 1,
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
