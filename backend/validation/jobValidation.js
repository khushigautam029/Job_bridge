import Joi from "joi";

const createJobSchema = Joi.object({
    categoryId: Joi.number()
        .integer()
        .positive()
        .required(),

    title: Joi.string()
        .trim()
        .max(150)
        .required(),

    description: Joi.string()
        .trim()
        .required(),

    requirements: Joi.string()
        .trim()
        .max(10000)
        .optional()
        .allow(null, ""),

    responsibilities: Joi.string()
        .trim()
        .max(10000)
        .optional()
        .allow(null, ""),

    location: Joi.string()
        .trim()
        .max(150)
        .optional()
        .allow(null, ""),

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
        .positive()
        .optional()
        .allow(null),

    maxSalary: Joi.number()
        .positive()
        .optional()
        .allow(null),

    experienceMin: Joi.number()
        .min(0)
        .max(99)
        .optional(),

    experienceMax: Joi.number()
        .min(0)
        .max(99)
        .optional()
        .allow(null),

    applicationDeadline: Joi.date()
        .iso()
        .optional()
        .allow(null),

    status: Joi.string()
        .valid(
            "DRAFT",
            "OPEN",
            "CLOSED"
        )
        .optional(),
});


const updateJobSchema = Joi.object({
    categoryId: Joi.number()
        .integer()
        .positive()
        .optional(),

    title: Joi.string()
        .trim()
        .max(150)
        .optional(),

    description: Joi.string()
        .trim()
        .optional(),

    requirements: Joi.string()
        .trim()
        .max(10000)
        .optional()
        .allow(null, ""),

    responsibilities: Joi.string()
        .trim()
        .max(10000)
        .optional()
        .allow(null, ""),

    location: Joi.string()
        .trim()
        .max(150)
        .optional()
        .allow(null, ""),

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
        .positive()
        .optional()
        .allow(null),

    maxSalary: Joi.number()
        .positive()
        .optional()
        .allow(null),

    experienceMin: Joi.number()
        .min(0)
        .max(99)
        .optional(),

    experienceMax: Joi.number()
        .min(0)
        .max(99)
        .optional()
        .allow(null),

    applicationDeadline: Joi.date()
        .iso()
        .optional()
        .allow(null),

    status: Joi.string()
        .valid(
            "DRAFT",
            "OPEN",
            "CLOSED"
        )
        .optional(),
});


/*
    Job search / filtering / pagination
*/
const searchJobSchema = Joi.object({
    search: Joi.string()
        .trim()
        .max(100)
        .optional()
        .allow(""),

    location: Joi.string()
        .trim()
        .max(150)
        .optional()
        .allow(""),

    categoryId: Joi.number()
        .integer()
        .positive()
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
        .optional(),

    experienceMax: Joi.number()
        .min(0)
        .optional(),

    sortBy: Joi.string()
        .valid(
            "createdAt",
            "title",
            "minSalary",
            "maxSalary",
            "applicationDeadline"
        )
        .default("createdAt"),

    order: Joi.string()
        .valid("ASC", "DESC")
        .default("DESC"),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10),
});


export {
    createJobSchema, searchJobSchema, updateJobSchema
};
