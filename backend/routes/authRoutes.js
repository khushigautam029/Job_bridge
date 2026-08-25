import express from "express";
import {
    login,
    register,
} from "../controllers/authController.js";
import validate from "../middleware/validateMiddleware.js";
import {
    loginSchema,
    registerSchema,
} from "../validation/authValidation.js";
const router = express.Router();
router.post( "/register", validate(registerSchema), register);
router.post( "/login", validate(loginSchema),login);

export default router;