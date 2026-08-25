import Joi from "joi";

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
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email",
            "any.required": "Email is required",
        }),
    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required",
            "any.required": "Password is required",
        }),
});


export {
    loginSchema, registerSchema
};
