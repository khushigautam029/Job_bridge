import {
    cancelInterview,
    getInterviewById,
    getMyInterviews,
    scheduleInterview,
    updateInterview,
    updateInterviewStatus,
} from "../services/interviewService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    createInterviewSchema,
    updateInterviewSchema,
    updateInterviewStatusSchema,
} from "../validation/interviewValidation.js";

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
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) =>
                        detail.message
                ),
            });
        }
        const interview =
            await scheduleInterview(
                req.user.id,
                req.params.applicationId,
                value
            );
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message:MESSAGES.INTERVIEW_SCHEDULED,
            data: {
                interview,
            },
        });
    }
);

const getMine = asyncHandler(
    async (req, res) => {
        const interviews =
            await getMyInterviews(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                interviews,
            },
        });
    }
);

// Candidate / Recruiter → One interview
const getOne = asyncHandler(
    async (req, res) => {
        const interview =
            await getInterviewById(
                req.user.id,
                req.params.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                interview,
            },
        });
    }
);


// Recruiter → Update interview
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
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) =>
                        detail.message
                ),
            });
        }
        const interview =
            await updateInterview(
                req.user.id,
                req.params.id,
                value
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message:MESSAGES.INTERVIEW_UPDATED,
            data: {
                interview,
            },
        });
    }
);


//  Recruiter → Update status
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
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) =>
                        detail.message
                ),
            });
        }
        const interview =
            await updateInterviewStatus(
                req.user.id,
                req.params.id,
                value.status
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message:MESSAGES.INTERVIEW_STATUS_UPDATED,
            data: {
                interview,
            },
        });
    }
);


// Recruiter → Cancel interview
const cancel = asyncHandler(
    async (req, res) => {
        await cancelInterview(
            req.user.id,
            req.params.id
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message:
                "Interview cancelled successfully",
        });
    }
);

export {
    cancel, getMine,
    getOne, schedule, update,
    updateStatus
};
