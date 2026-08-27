import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

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
                MESSAGES.PROVIDE_VALID_PHONE_NO,
        }),
}).min(1);

export {
    updateRecruiterProfileSchema
};
