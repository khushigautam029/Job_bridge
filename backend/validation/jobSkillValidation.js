import Joi from "joi";

const addJobSkillSchema = Joi.object({
    skillId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Skill ID must be a number",
            "number.integer": "Skill ID must be an integer",
            "number.positive": "Skill ID must be a positive number",
            "any.required": "Skill ID is required",
        }),
});

export {
    addJobSkillSchema
};
