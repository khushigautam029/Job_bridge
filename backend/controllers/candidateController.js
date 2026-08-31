import {
    getCandidateProfile,
    updateCandidateProfile,
} from "../services/candidateService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    updateCandidateProfileSchema,
} from "../validation/candidateValidation.js";

const getProfile = asyncHandler(
    async (req, res) => {
        const candidate =
            await getCandidateProfile(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                candidate,
            },
        });
    }
);

const updateProfile = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = updateCandidateProfileSchema.validate(
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
        const candidate =
            await updateCandidateProfile(
                req.user.id,
                value
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message:MESSAGES.PROFILE_UPDATED,
            data: {
                candidate,
            },
        });
    }
);

export {
    getProfile,
    updateProfile
};
