import Joi from "joi";

const employmentTypes = [
    "INTERNSHIP",
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "FREELANCE",
];

const createCandidateExperienceSchema = Joi.object({
    companyName: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
            "string.empty": "Company name is required",
            "string.max": "Company name cannot exceed 255 characters",
            "any.required": "Company name is required",
        }),

    jobTitle: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
            "string.empty": "Job title is required",
            "string.max": "Job title cannot exceed 255 characters",
            "any.required": "Job title is required",
        }),

    employmentType: Joi.string()
        .valid(...employmentTypes)
        .required()
        .messages({
            "any.only":
                "Employment type must be INTERNSHIP, FULL_TIME, PART_TIME, CONTRACT, or FREELANCE",
            "any.required": "Employment type is required",
        }),

    location: Joi.string()
        .trim()
        .max(150)
        .allow("", null)
        .optional(),

    startDate: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            "date.format": "Start date must be a valid date",
        }),

    endDate: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            "date.format": "End date must be a valid date",
        }),

    currentlyWorking: Joi.boolean()
        .default(false)
        .optional(),

    description: Joi.string()
        .trim()
        .max(5000)
        .allow("", null)
        .optional(),

    skills: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(100)
        )
        .max(30)
        .allow(null)
        .optional()
        .messages({
            "array.max": "You can add a maximum of 30 skills",
        }),
})
    .custom((value, helpers) => {
        if (
            value.startDate &&
            value.endDate &&
            new Date(value.endDate) < new Date(value.startDate)
        ) {
            return helpers.error("any.invalid");
        }

        if (
            value.currentlyWorking === true &&
            value.endDate
        ) {
            return helpers.error("any.invalid");
        }

        return value;
    })
    .messages({
        "any.invalid":
            "End date cannot be before start date, and currently working experience cannot have an end date",
    });

const updateCandidateExperienceSchema = Joi.object({
    companyName: Joi.string()
        .trim()
        .max(255)
        .optional(),

    jobTitle: Joi.string()
        .trim()
        .max(255)
        .optional(),

    employmentType: Joi.string()
        .valid(...employmentTypes)
        .optional(),

    location: Joi.string()
        .trim()
        .max(150)
        .allow("", null)
        .optional(),

    startDate: Joi.date()
        .iso()
        .allow(null)
        .optional(),

    endDate: Joi.date()
        .iso()
        .allow(null)
        .optional(),

    currentlyWorking: Joi.boolean()
        .optional(),

    description: Joi.string()
        .trim()
        .max(5000)
        .allow("", null)
        .optional(),

    skills: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(100)
        )
        .max(30)
        .allow(null)
        .optional(),
})
    .min(1)
    .custom((value, helpers) => {
        if (
            value.startDate &&
            value.endDate &&
            new Date(value.endDate) < new Date(value.startDate)
        ) {
            return helpers.error("any.invalid");
        }

        if (
            value.currentlyWorking === true &&
            value.endDate
        ) {
            return helpers.error("any.invalid");
        }

        return value;
    })
    .messages({
        "object.min":
            "At least one field is required for update",

        "any.invalid":
            "End date cannot be before start date, and currently working experience cannot have an end date",
    });

export {
    createCandidateExperienceSchema,
    updateCandidateExperienceSchema
};

