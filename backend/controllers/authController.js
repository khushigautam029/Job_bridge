import {
    loginUser,
    registerUser,
    requestPasswordReset,
    resetPassword as resetUserPassword,
} from "../services/authService.js";

import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

import { sendSuccess } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);
    const token = generateToken(user);

    return sendSuccess(
        res,
        STATUS_CODES.CREATED,
        MESSAGES.REGISTRATION_SUCCESS,
        {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }
    );
});

const login = asyncHandler(async (req, res) => {
    const user = await loginUser(req.body);
    const token = generateToken(user);

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.LOGIN_SUCCESS,
        {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
    await requestPasswordReset(req.body);

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.PASSWORD_RESET_EMAIL_SENT
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    await resetUserPassword(req.body);

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.PASSWORD_RESET_SUCCESS
    );
});

export {
    forgotPassword, login,
    register, resetPassword
};
