import asyncHandler from "../utils/asyncHandler.js";

import {
    changePassword,
    deleteAccount,
    getUserById,
    updateUserProfile,
} from "../services/userService.js";

import {
    changePasswordSchema,
    updateProfileSchema,
} from "../validation/userValidation.js";


const getMe = asyncHandler(async (req, res) => {
    const user = await getUserById(req.user.id);
    res.status(200).json({
        success: true,
        data: {
            user,
        },
    });
});


const updateProfile = asyncHandler(async (req, res) => {
    const { error, value } = updateProfileSchema.validate(
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
    const user = await updateUserProfile(
        req.user.id,
        value
    );
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
            user,
        },
    });
});


const updatePassword = asyncHandler(async (req, res) => {
    const { error, value } = changePasswordSchema.validate(
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
    await changePassword(
        req.user.id,
        value.currentPassword,
        value.newPassword
    );
    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});


const removeAccount = asyncHandler(async (req, res) => {
    await deleteAccount(req.user.id);
    res.status(200).json({
        success: true,
        message: "Account deleted successfully",
    });
});


export {
    getMe, removeAccount, updatePassword, updateProfile
};
