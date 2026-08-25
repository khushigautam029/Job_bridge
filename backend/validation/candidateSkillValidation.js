import Joi from "joi";


const addCandidateSkillSchema = Joi.object({
    skillId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Skill ID must be a number",

            "number.integer":
                "Skill ID must be an integer",

            "number.positive":
                "Skill ID must be positive",

            "any.required":
                "Skill ID is required",
        }),
});


export {
    addCandidateSkillSchema
};
