import {
    cancelInterview,
    getInterviewById,
    getMyInterviews,
    getRecruiterInterviews,
    scheduleInterview,
    updateInterview,
    updateInterviewStatus,
} from "../services/interviewService.js";
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
    createInterviewSchema,
    updateInterviewSchema,
    updateInterviewStatusSchema,
} from "../validation/interviewValidation.js";

// Recruiter → Schedule Interview
const schedule = asyncHandler(
    async (req, res) => {
        const { error, value } =
            createInterviewSchema.validate(
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

        const interview =
            await scheduleInterview(
                req.user.id,
                req.params.applicationId,
                value
            );

        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.INTERVIEW_SCHEDULED,
            {
                interview,
            }
        );
    }
);

// Candidate → My Interviews
const getMine = asyncHandler(
    async (req, res) => {
        const interviews =
            await getMyInterviews(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.INTERVIEWS_FETCHED,
            {
                interviews,
            }
        );
    }
);

// Recruiter → My Interviews
const getRecruiterMine =
    asyncHandler(async (req, res) => {
        const interviews =
            await getRecruiterInterviews(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.INTERVIEWS_FETCHED,
            {
                interviews,
            }
        );
    });

// Candidate / Recruiter → One Interview
const getOne = asyncHandler(
    async (req, res) => {
        const interview =
            await getInterviewById(
                req.user.id,
                req.params.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.INTERVIEW_FETCHED,
            {
                interview,
            }
        );
    }
);

// Recruiter → Update Interview
const update = asyncHandler(
    async (req, res) => {
        const { error, value } =
            updateInterviewSchema.validate(
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

        const interview =
            await updateInterview(
                req.user.id,
                req.params.id,
                value
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.INTERVIEW_UPDATED,
            {
                interview,
            }
        );
    }
);

// Recruiter → Update Status
const updateStatus = asyncHandler(
    async (req, res) => {
        const { error, value } =
            updateInterviewStatusSchema.validate(
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

        const interview =
            await updateInterviewStatus(
                req.user.id,
                req.params.id,
                value.status
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.INTERVIEW_STATUS_UPDATED,
            {
                interview,
            }
        );
    }
);

// Recruiter → Cancel Interview
const cancel = asyncHandler(
    async (req, res) => {
        await cancelInterview(
            req.user.id,
            req.params.id
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.INTERVIEW_CANCELLED
        );
    }
);

export {
    cancel,
    getMine, getOne, getRecruiterMine, schedule,
    update,
    updateStatus
};

