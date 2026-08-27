import rateLimit from "express-rate-limit";
import { MESSAGES } from "./setConstants";

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: MESSAGES.TOO_MANY_REQUESTS,
    },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: MESSAGES.TOO_MANY_AUTHENTICATION_REQUESTS,
    },
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: MESSAGES.TOO_MANY_LOGIN_REQUESTS,
    },
});

export { authLimiter, generalLimiter, loginLimiter };
