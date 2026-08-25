import asyncHandler from "../utils/asyncHandler.js";

import {
    getRecruiterProfile,
    updateRecruiterProfile,
} from "../services/recruiterService.js";

import {
    updateRecruiterProfileSchema,
} from "../validation/recruiterValidation.js";


const getProfile = asyncHandler(async (req, res) => {

    const recruiter = await getRecruiterProfile(
        req.user.id
    );

    res.status(200).json({
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
        return res.status(400).json({
            success: false,
            message: "Validation failed",
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

    res.status(200).json({
        success: true,
        message: "Recruiter profile updated successfully",
        data: {
            recruiter,
        },
    });
});


export {
    getProfile,
    updateProfile
};
