import {
    loginUser,
    registerUser,
} from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import {
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

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

export {
    login,
    register
};
