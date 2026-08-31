import {
    createJob,
    deleteJob,
    getAllJobs,
    getJobById,
    updateJob,
} from "../services/jobService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    createJobSchema,
    updateJobSchema,
} from "../validation/jobValidation.js";

// CREATE JOB
const create = asyncHandler(async (req, res) => {
    const { error, value } =
        createJobSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );
    if (error) {
        return res.status(
            STATUS_CODES.BAD_REQUEST
        ).json({
            success: false,
            message: MESSAGES.VALIDATION_FAILED,
            errors: error.details.map(
                (detail) => detail.message
            ),
        });
    }
    const job = await createJob(
        req.user.id,
        value
    );
    return res.status(
        STATUS_CODES.CREATED
    ).json({
        success: true,
        message: MESSAGES.JOB_CREATED,
        data: {
            job,
        },
    });
});

// GET ALL JOBS
const getAll = asyncHandler(async (req, res) => {
    const result =
        await getAllJobs(req.query);
    return res.status(
        STATUS_CODES.OK
    ).json({
        success: true,
        message: MESSAGES.JOB_FETCHED,
        data: result,
    });
});

// GET JOB BY ID
const getOne = asyncHandler(async (req, res) => {
    const job = await getJobById(
        req.params.id
    );
    return res.status(
        STATUS_CODES.OK
    ).json({
        success: true,
        message: MESSAGES.JOB_FETCHED,
        data: {
            job,
        },
    });
});

// UPDATE JOB
const update = asyncHandler(async (req, res) => {
    const { error, value } =
        updateJobSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );
    if (error) {
        return res.status(
            STATUS_CODES.BAD_REQUEST
        ).json({
            success: false,
            message: MESSAGES.VALIDATION_FAILED,
            errors: error.details.map(
                (detail) => detail.message
            ),
        });
    }
    const job = await updateJob(
        req.user.id,
        req.params.id,
        value
    );
    return res.status(
        STATUS_CODES.OK
    ).json({
        success: true,
        message: MESSAGES.JOB_UPDATED,
        data: {
            job,
        },
    });
});

// DELETE JOB
const remove = asyncHandler(async (req, res) => {
    await deleteJob(
        req.user.id,
        req.params.id
    );
    return res.status(
        STATUS_CODES.OK
    ).json({
        success: true,
        message: MESSAGES.JOB_DELETED,
    });
});

export {
    create,
    getAll,
    getOne, remove, update
};
