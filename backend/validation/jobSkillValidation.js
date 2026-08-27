import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

const addJobSkillSchema = Joi.object({
    skillId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": MESSAGES.SKILL_MUST_BE_NUMBER,
            "number.integer": MESSAGES.SKILL_ID_MUST_BE_INT,
            "number.positive": MESSAGES.SKILL_ID_MUST_BE_POSITIVE,
            "any.required": MESSAGES.SKILL_ID_REQUIRED,
        }),
});

export {
    addJobSkillSchema
};
