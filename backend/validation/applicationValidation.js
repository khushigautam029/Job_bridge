import Joi from "joi";


const createApplicationSchema = Joi.object({

    resume: Joi.string()
        .trim()
        .max(255)
        .optional()
        .allow(null, ""),

    coverLetter: Joi.string()
        .trim()
        .max(5000)
        .optional()
        .allow(null, ""),

    expectedSalary: Joi.number()
        .positive()
        .optional()
        .allow(null),

    noticePeriod: Joi.number()
        .integer()
        .min(0)
        .max(365)
        .optional()
        .allow(null),

});


const updateApplicationStatusSchema = Joi.object({

    status: Joi.string()
        .valid(
            "UNDER_REVIEW",
            "SHORTLISTED",
            "INTERVIEW",
            "SELECTED",
            "REJECTED"
        )
        .required()
        .messages({
            "any.only": "Invalid application status",
            "any.required": "Application status is required",
        }),

});


export {
    createApplicationSchema,
    updateApplicationStatusSchema
};
ss