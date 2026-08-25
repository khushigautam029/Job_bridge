import Joi from "joi";

const createJobSchema = Joi.object({
    categoryId: Joi.number()
        .integer()
        .positive()
        .required(),

    title: Joi.string()
        .trim()
        .min(3)
        .max(150)
        .required(),

    description: Joi.string()
        .trim()
        .min(10)
        .required(),

    requirements: Joi.string()
        .trim()
        .allow("")
        .optional(),

    responsibilities: Joi.string()
        .trim()
        .allow("")
        .optional(),

    location: Joi.string()
        .trim()
        .max(150)
        .allow("")
        .optional(),

    jobType: Joi.string()
        .valid(
            "FULL_TIME",
            "PART_TIME",
            "INTERNSHIP",
            "CONTRACT",
            "FREELANCE"
        )
        .required(),

    workMode: Joi.string()
        .valid(
            "REMOTE",
            "ONSITE",
            "HYBRID"
        )
        .required(),

    minSalary: Joi.number()
        .min(0)
        .optional(),

    maxSalary: Joi.number()
        .min(0)
        .optional(),

    experienceMin: Joi.number()
        .min(0)
        .max(99.9)
        .precision(1)
        .default(0),

    experienceMax: Joi.number()
        .min(0)
        .max(99.9)
        .precision(1)
        .optional(),

    applicationDeadline: Joi.date()
        .iso()
        .optional(),

    status: Joi.string()
        .valid(
            "DRAFT",
            "OPEN",
            "CLOSED"
        )
        .default("DRAFT"),
});


const updateJobSchema = Joi.object({
    categoryId: Joi.number()
        .integer()
        .positive()
        .optional(),

    title: Joi.string()
        .trim()
        .min(3)
        .max(150)
        .optional(),

    description: Joi.string()
        .trim()
        .min(10)
        .optional(),

    requirements: Joi.string()
        .trim()
        .allow("")
        .optional(),

    responsibilities: Joi.string()
        .trim()
        .allow("")
        .optional(),

    location: Joi.string()
        .trim()
        .max(150)
        .allow("")
        .optional(),

    jobType: Joi.string()
        .valid(
            "FULL_TIME",
            "PART_TIME",
            "INTERNSHIP",
            "CONTRACT",
            "FREELANCE"
        )
        .optional(),

    workMode: Joi.string()
        .valid(
            "REMOTE",
            "ONSITE",
            "HYBRID"
        )
        .optional(),

    minSalary: Joi.number()
        .min(0)
        .optional(),

    maxSalary: Joi.number()
        .min(0)
        .optional(),

    experienceMin: Joi.number()
        .min(0)
        .max(99.9)
        .precision(1)
        .optional(),

    experienceMax: Joi.number()
        .min(0)
        .max(99.9)
        .precision(1)
        .optional(),

    applicationDeadline: Joi.date()
        .iso()
        .optional(),

    status: Joi.string()
        .valid(
            "DRAFT",
            "OPEN",
            "CLOSED"
        )
        .optional(),
}).min(1);


export {
    createJobSchema,
    updateJobSchema
};
