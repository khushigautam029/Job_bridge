import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

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
            "string.uri": MESSAGES.PROVIDE_A_VALID_WEB_URL,
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
