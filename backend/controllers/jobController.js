import asyncHandler from "../utils/asyncHandler.js";

import {
    createJob,
    deleteJob,
    getAllJobs,
    getJobById,
    updateJob,
} from "../services/jobService.js";

import {
    createJobSchema,
    updateJobSchema,
} from "../validation/jobValidation.js";


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
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }

        const job = await createJob(
            req.user.id,
            value
        );

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: {
                job,
            },
        });
    }
);


const getAll = asyncHandler(
    async (req, res) => {

        const jobs = await getAllJobs();

        res.status(200).json({
            success: true,
            data: {
                jobs,
            },
        });
    }
);


const getOne = asyncHandler(
    async (req, res) => {

        const job = await getJobById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: {
                job,
            },
        });
    }
);


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
            return res.status(400).json({
                success: false,
                message: "Validation failed",
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

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: {
                job,
            },
        });
    }
);


const remove = asyncHandler(
    async (req, res) => {

        await deleteJob(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    }
);


export {
    create,
    getAll,
    getOne, remove, update
};
