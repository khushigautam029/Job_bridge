import {
    applyForJob,
    getApplicationById,
    getJobApplications,
    getMyApplications,
    getRecruiterApplications,
    updateApplicationStatus,
    withdrawApplication,
} from "../services/applicationService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
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
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.VALIDATION_FAILED,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const application =
            await applyForJob(
                req.user.id,
                req.params.jobId,
                value
            );

        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.APPLIED,
            {
                application,
            }
        );
    }
);

const getMine = asyncHandler(
    async (req, res) => {
        const applications =
            await getMyApplications(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            "Applications retrieved successfully",
            {
                applications,
            }
        );
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

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            "Application retrieved successfully",
            {
                application,
            }
        );
    }
);

// Candidate → Withdraw
const withdraw = asyncHandler(
    async (req, res) => {
        await withdrawApplication(
            req.user.id,
            req.params.id
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.APPLICATION_WITHDRAWN
        );
    }
);

const getForJob = asyncHandler(
    async (req, res) => {
        const applications =
            await getJobApplications(
                req.user.id,
                req.params.jobId
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            "Job applications retrieved successfully",
            {
                applications,
            }
        );
    }
);

const getForRecruiter = asyncHandler(
    async (req, res) => {
        const applications =
            await getRecruiterApplications(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            "Recruiter applications retrieved successfully",
            {
                applications,
            }
        );
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
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.VALIDATION_FAILED,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const application =
            await updateApplicationStatus(
                req.user.id,
                req.params.id,
                value.status
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.APPLICATION_STATUS_UPDATED,
            {
                application,
            }
        );
    }
);

export {
    apply,
    getForJob,
    getForRecruiter,
    getMine,
    getOne,
    updateStatus,
    withdraw
};

