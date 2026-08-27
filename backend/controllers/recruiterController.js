import asyncHandler from "../utils/asyncHandler.js";

import {
    getRecruiterProfile,
    updateRecruiterProfile,
} from "../services/recruiterService.js";

import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    updateRecruiterProfileSchema,
} from "../validation/recruiterValidation.js";


const getProfile = asyncHandler(async (req, res) => {

    const recruiter = await getRecruiterProfile(
        req.user.id
    );

    res.status(STATUS_CODES.OK).json({
        success: true,
        data: {
            recruiter,
        },
    });
});


const updateProfile = asyncHandler(async (req, res) => {

    const { error, value } =
        updateRecruiterProfileSchema.validate(
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

    const recruiter =
        await updateRecruiterProfile(
            req.user.id,
            value
        );

    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.RECRUITER_PROFILE_FETCHED,
        data: {
            recruiter,
        },
    });
});


export {
    getProfile,
    updateProfile
};
