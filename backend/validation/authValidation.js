import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),
    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required(),
    password: Joi.string()
        .min(8)
        .max(100)
        .required(),
    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .optional(),
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
    loginSchema, registerSchema
};
