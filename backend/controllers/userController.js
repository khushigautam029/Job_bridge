import {
    changePassword,
    deleteAccount,
    getUserById
} from "../services/userService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    changePasswordSchema
} from "../validation/userValidation.js";

const getMe = asyncHandler(async (req, res) => {
    const user = await getUserById(req.user.id);
    res.status(STATUS_CODES.OK).json({
        success: true,
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
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.VALIDATION_FAILED,
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
    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.PASSWORD_CHANGED,
    });
});

const removeAccount = asyncHandler(async (req, res) => {
    await deleteAccount(req.user.id);
    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.USER_ACCOUNT_DELETED,
    });
});

export {
    getMe, removeAccount, updatePassword
};
