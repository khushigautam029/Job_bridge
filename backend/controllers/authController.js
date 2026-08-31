import {
    loginUser,
    registerUser,
} from "../services/authService.js";

import asyncHandler from "../utils/asyncHandler.js";

import generateToken from "../utils/generateToken.js";

import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);

    const token = generateToken(user);

    res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.REGISTRATION_SUCCESS,
        data: {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const user = await loginUser(req.body);

    const token = generateToken(user);

    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
        data: {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });
});

export {
    login,
    register
};
