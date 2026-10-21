import express from "express";

import {
    forgotPassword,
    login,
    register,
    resetPassword,
} from "../controllers/authController.js";

import validate from "../middleware/validateMiddleware.js";

import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "../validation/authValidation.js";

const router = express.Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
);

export default router;