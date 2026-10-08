import Joi from "joi";

const createCandidateEducationSchema =
    Joi.object({

        degree: Joi.string()
            .trim()
            .min(2)
            .max(255)
            .required(),

        fieldOfStudy: Joi.string()
            .trim()
            .max(255)
            .allow("")
            .optional(),

        institution: Joi.string()
            .trim()
            .min(2)
            .max(255)
            .required(),

        location: Joi.string()
            .trim()
            .max(150)
            .allow("")
            .optional(),

        startDate: Joi.date()
            .iso()
            .allow("")
            .optional(),

        endDate: Joi.date()
            .iso()
            .allow("")
            .optional(),

        grade: Joi.string()
            .trim()
            .max(100)
            .allow("")
            .optional(),

        description: Joi.string()
            .trim()
            .max(2000)
            .allow("")
            .optional(),

    });

const updateCandidateEducationSchema =
    Joi.object({

        degree: Joi.string()
            .trim()
            .min(2)
            .max(255)
            .optional(),

        fieldOfStudy: Joi.string()
            .trim()
            .max(255)
            .allow("")
            .optional(),

        institution: Joi.string()
            .trim()
            .min(2)
            .max(255)
            .optional(),

        location: Joi.string()
            .trim()
            .max(150)
            .allow("")
            .optional(),

        startDate: Joi.date()
            .iso()
            .allow("")
            .optional(),

        endDate: Joi.date()
            .iso()
            .allow("")
            .optional(),

        grade: Joi.string()
            .trim()
            .max(100)
            .allow("")
            .optional(),

        description: Joi.string()
            .trim()
            .max(2000)
            .allow("")
            .optional(),

    }).min(1);


export {
    createCandidateEducationSchema,
    updateCandidateEducationSchema
};

