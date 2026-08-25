import Joi from "joi";


const updateProfileSchema = Joi.object({
    name: Joi.string()
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


const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required(),

    newPassword: Joi.string()
        .min(8)
        .max(100)
        .required(),
}).required();


export {
    changePasswordSchema, updateProfileSchema
};
