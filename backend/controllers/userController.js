import {
    changePassword,
    deleteAccount,
    getUserById,
    getUserPreferences,
    updateUserPreferences,
    updateUserProfile,
} from "../services/userService.js";
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
    changePasswordSchema,
    updateProfileSchema,
    userPreferencesSchema,
} from "../validation/userValidation.js";

// GET CURRENT USER
const getMe = asyncHandler(
    async (req, res) => {
        const user =
            await getUserById(
                req.user.id
            );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.USER_PROFILE_FETCHED,
            {
                user,
            }
        );
    }
);

const updateProfile = asyncHandler(async (req, res) => {
    const { error, value } = updateProfileSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.VALIDATION_FAILED,
            error.details.map((detail) => detail.message)
        );
    }
    if (value.phone === "") value.phone = null;
    const user = await updateUserProfile(req.user.id, value);
    return sendSuccess(res, STATUS_CODES.OK, MESSAGES.USER_PROFILE_UPDATED, { user });
});

const getPreferences = asyncHandler(async (req, res) => {
    const preferences = await getUserPreferences(req.user.id);
    return sendSuccess(res, STATUS_CODES.OK, "Settings fetched successfully", { preferences });
});

const savePreferences = asyncHandler(async (req, res) => {
    const { error, value } = userPreferencesSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.VALIDATION_FAILED,
            error.details.map((detail) => detail.message)
        );
    }
    const updates = {};
    if (value.notificationSettings) updates.notificationSettings = value.notificationSettings;
    if (value.privacySettings) updates.privacySettings = value.privacySettings;
    const preferences = await updateUserPreferences(req.user.id, updates);
    return sendSuccess(res, STATUS_CODES.OK, "Settings saved successfully", { preferences });
});

// CHANGE PASSWORD
const updatePassword = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = changePasswordSchema.validate(
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
        await changePassword(
            req.user.id,
            value.currentPassword,
            value.newPassword
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.PASSWORD_CHANGED
        );
    }
);

// DELETE ACCOUNT
const removeAccount = asyncHandler(
    async (req, res) => {
        await deleteAccount(
            req.user.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.USER_ACCOUNT_DELETED
        );
    }
);

export {
    getMe,
    getPreferences,
    removeAccount,
    savePreferences,
    updateProfile,
    updatePassword
};

