import {
    analyzeJobApplicationsBatch,
    applyForJob,
    getApplicationAtsScore,
    getApplicationById,
    getJobApplications,
    getMyApplications,
    getRankedJobApplications,
    getRecruiterApplications,
    updateApplicationStatus,
    withdrawApplication
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
            MESSAGES.APPLICATIONS_RETRIEVED,
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
            MESSAGES.APPLICATION_RETRIEVED,
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
            MESSAGES.JOB_APPLICATIONS_RETRIEVED,
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
            MESSAGES.RECRUITER_APPLICATIONS_RETRIEVED,
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


const getAtsScore = asyncHandler(async (req, res) => {
    const result = await getApplicationAtsScore(
        req.user.id,
        req.params.id
    );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        "ATS score calculated successfully.",
        result
    );
});


const runJobAtsAnalysis = asyncHandler(async (req, res) => {
    const jobId = Number(req.params.jobId);
    const afterApplicationId = Number(
        req.query.afterApplicationId ?? 0
    );

    if (
        !Number.isSafeInteger(jobId) ||
        jobId <= 0 ||
        !Number.isSafeInteger(afterApplicationId) ||
        afterApplicationId < 0
    ) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Invalid job ID or application cursor."
        );
    }

    const result = await analyzeJobApplicationsBatch(
        req.user.id,
        jobId,
        afterApplicationId
    );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        "ATS batch processed successfully.",
        result
    );
});


const getRankedApplicants = asyncHandler(async (req, res) => {
    const jobId = Number(req.params.jobId);
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    if (
        !Number.isSafeInteger(jobId) ||
        jobId <= 0 ||
        !Number.isSafeInteger(page) ||
        page < 1 ||
        !Number.isSafeInteger(limit) ||
        limit < 1 ||
        limit > 100
    ) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Invalid job ID or pagination parameters. Limit must be between 1 and 100."
        );
    }

    const result = await getRankedJobApplications(
        req.user.id,
        jobId,
        page,
        limit
    );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        "Ranked applicants fetched successfully.",
        result
    );
});


export {
    apply, getAtsScore, getForJob, getForRecruiter, getMine,
    getOne, getRankedApplicants, runJobAtsAnalysis, updateStatus,
    withdraw
};

