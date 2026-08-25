import Joi from "joi";

const updateRecruiterProfileSchema = Joi.object({
    designation: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .optional()
        .messages({
            "string.pattern.base":
                "Please provide a valid Indian phone number",
        }),
}).min(1);

export {
    updateRecruiterProfileSchema
};
