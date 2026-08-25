import Joi from "joi";

const updateCompanySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .optional(),

    description: Joi.string()
        .trim()
        .max(2000)
        .allow("")
        .optional(),

    logo: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional(),

    website: Joi.string()
        .trim()
        .uri()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.uri": "Please provide a valid website URL",
        }),

    location: Joi.string()
        .trim()
        .max(150)
        .allow("")
        .optional(),
}).min(1);

export {
    updateCompanySchema
};
