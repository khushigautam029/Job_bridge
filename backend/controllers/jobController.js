import {
    createJob,
    deleteJob,
    getAllJobs,
    getJobById,
    getJobCategories,
    getRecruiterJobs,
    updateJob,
} from "../services/jobService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendError,
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";
import {
    createJobSchema,
    searchJobSchema,
    updateJobSchema,
} from "../validation/jobValidation.js";

// CREATE JOB
const create = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = createJobSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );

        if (error) {
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.VALIDATION_FAILED,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const job = await createJob(
            req.user.id,
            value
        );

        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.JOB_CREATED,
            {
                job,
            }
        );
    }
);

// GET ALL JOBS
const getAll = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = searchJobSchema.validate(
            req.query,
            {
                abortEarly: false,
                stripUnknown: true,
                convert: true,
            }
        );

        if (error) {
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.VALIDATION_FAILED,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const result =
            await getAllJobs(value);

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOBS_FETCHED,
            result
        );
    }
);

// GET JOB CATEGORIES
const getCategories = asyncHandler(
    async (req, res) => {
        const categories =
            await getJobCategories();

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOB_CATEGORIES_FETCHED,
            {
                categories,
            }
        );
    }
);

// GET RECRUITER'S JOBS
const getMine = asyncHandler(
    async (req, res) => {
        const jobs =
            await getRecruiterJobs(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.RECRUITER_JOBS_FETCHED,
            {
                jobs,
            }
        );
    }
);

// GET JOB BY ID
const getOne = asyncHandler(
    async (req, res) => {
        const job =
            await getJobById(
                req.params.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOB_FETCHED,
            {
                job,
            }
        );
    }
);

// UPDATE JOB
const update = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = updateJobSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );

        if (error) {
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.VALIDATION_FAILED,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const job =
            await updateJob(
                req.user.id,
                req.params.id,
                value
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOB_UPDATED,
            {
                job,
            }
        );
    }
);

// DELETE JOB
const remove = asyncHandler(
    async (req, res) => {
        await deleteJob(
            req.user.id,
            req.params.id
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOB_DELETED
        );
    }
);

export {
    create, getAll, getCategories, getMine,
    getOne,
    remove,
    update
};
