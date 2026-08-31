import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name cannot exceed 100 characters",
            "any.required": "Name is required",
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required()
        .messages({
            "string.empty": MESSAGES.EMAIL_REQUIRED,
            "string.email": MESSAGES.PROVIDE_A_VALID_EMAIL,
            "any.required": MESSAGES.EMAIL_REQUIRED,
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
        .messages({
            "string.empty": MESSAGES.PASSWORD_REQUIRED,
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password cannot exceed 100 characters",
            "any.required": MESSAGES.PASSWORD_REQUIRED,
        }),

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .optional()
        .allow("")
        .messages({
            "string.pattern.base":
                "Please provide a valid 10-digit Indian phone number",
        }),

    role: Joi.string()
        .valid("CANDIDATE", "RECRUITER")
        .default("CANDIDATE"),

    companyName: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .when("role", {
            is: "RECRUITER",
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        })
        .messages({
            "string.empty": "Company name is required for recruiters",
            "any.required": "Company name is required for recruiters",
        }),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": MESSAGES.EMAIL_REQUIRED,
            "string.email": MESSAGES.PROVIDE_A_VALID_EMAIL,
            "any.required": MESSAGES.EMAIL_REQUIRED,
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": MESSAGES.PASSWORD_REQUIRED,
            "any.required": MESSAGES.PASSWORD_REQUIRED,
        }),
});

export {
    loginSchema,
    registerSchema
};
