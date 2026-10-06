import {
    changePassword,
    deleteAccount,
    getUserById,
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
    removeAccount,
    updatePassword
};

