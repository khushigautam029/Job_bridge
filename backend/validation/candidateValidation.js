import Joi from "joi";

const updateCandidateProfileSchema = Joi.object({
    location: Joi.string()
        .trim()
        .max(150)
        .allow("")
        .optional(),

    bio: Joi.string()
        .trim()
        .max(2000)
        .allow("")
        .optional(),

    profileImage: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional(),

    resume: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional(),

    linkedinUrl: Joi.string()
        .trim()
        .uri()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.uri": "Please provide a valid LinkedIn URL",
        }),

    githubUrl: Joi.string()
        .trim()
        .uri()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.uri": "Please provide a valid GitHub URL",
        }),

    portfolioUrl: Joi.string()
        .trim()
        .uri()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.uri": "Please provide a valid portfolio URL",
        }),

    experienceYears: Joi.number()
        .min(0)
        .max(99.9)
        .precision(1)
        .optional(),
}).min(1);

export {
    updateCandidateProfileSchema
};
