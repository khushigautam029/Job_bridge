import {
    applyForJob,
    getApplicationById,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    withdrawApplication,
} from "../services/applicationService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    createApplicationSchema,
    updateApplicationStatusSchema,
} from "../validation/applicationValidation.js";

const apply = asyncHandler(
    async (req, res) => {
        const { error, value } =
            createApplicationSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }

        const application =
            await applyForJob(
                req.user.id,
                req.params.jobId,
                value
            );

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.APPLIED,
            data: {
                application,
            },
        });
    }
);

const getMine = asyncHandler(
    async (req, res) => {
        const applications =
            await getMyApplications(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                applications,
            },
        });
    }
);

// Candidate / Recruiter → One application
const getOne = asyncHandler(
    async (req, res) => {
        const application =
            await getApplicationById(
                req.user.id,
                req.params.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                application,
            },
        });
    }
);

// Candidate → Withdraw
const withdraw = asyncHandler(
    async (req, res) => {
        await withdrawApplication(
            req.user.id,
            req.params.id
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.APPLICATION_WITHDRAWN ,
        });
    }
);

const getForJob = asyncHandler(
    async (req, res) => {
        const applications =
            await getJobApplications(
                req.user.id,
                req.params.jobId
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                applications,
            },
        });
    }
);

// Recruiter → Update status
const updateStatus = asyncHandler(
    async (req, res) => {
        const { error, value } =
            updateApplicationStatusSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );
        if (error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }
        const application =
            await updateApplicationStatus(
                req.user.id,
                req.params.id,
                value.status
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.APPLICATION_STATUS_UPDATED,
            data: {
                application,
            },
        });
    }
);

export {
    apply, getForJob, getMine,
    getOne, updateStatus, withdraw
};
