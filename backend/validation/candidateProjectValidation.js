import Joi from "joi";

const createCandidateProjectSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
            "string.empty": "Project title is required",
            "string.max":
                "Project title cannot exceed 255 characters",
            "any.required":
                "Project title is required",
        }),

    description: Joi.string()
        .trim()
        .max(5000)
        .allow("", null)
        .optional(),

    technologies: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(100)
        )
        .max(30)
        .allow(null)
        .optional()
        .messages({
            "array.max":
                "You can add a maximum of 30 technologies",
        }),

    projectUrl: Joi.string()
        .trim()
        .uri({
            scheme: [
                "http",
                "https",
            ],
        })
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.uri":
                "Project URL must be a valid HTTP or HTTPS URL",
            "string.max":
                "Project URL cannot exceed 500 characters",
        }),

    githubUrl: Joi.string()
        .trim()
        .uri({
            scheme: [
                "http",
                "https",
            ],
        })
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.uri":
                "GitHub URL must be a valid HTTP or HTTPS URL",
            "string.max":
                "GitHub URL cannot exceed 500 characters",
        }),

    startDate: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            "date.format":
                "Start date must be a valid date",
        }),

    endDate: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            "date.format":
                "End date must be a valid date",
        }),

    currentlyWorking: Joi.boolean()
        .default(false)
        .optional(),

    role: Joi.string()
        .trim()
        .max(255)
        .allow("", null)
        .optional(),
})
    .custom((value, helpers) => {
        if (
            value.startDate &&
            value.endDate &&
            new Date(value.endDate) <
                new Date(value.startDate)
        ) {
            return helpers.error(
                "any.invalid"
            );
        }

        if (
            value.currentlyWorking === true &&
            value.endDate
        ) {
            return helpers.error(
                "any.invalid"
            );
        }

        return value;
    })
    .messages({
        "any.invalid":
            "End date cannot be before start date, and a currently working project cannot have an end date",
    });


const updateCandidateProjectSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(255)
        .optional(),

    description: Joi.string()
        .trim()
        .max(5000)
        .allow("", null)
        .optional(),

    technologies: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(100)
        )
        .max(30)
        .allow(null)
        .optional(),

    projectUrl: Joi.string()
        .trim()
        .uri({
            scheme: [
                "http",
                "https",
            ],
        })
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.uri":
                "Project URL must be a valid HTTP or HTTPS URL",
            "string.max":
                "Project URL cannot exceed 500 characters",
        }),

    githubUrl: Joi.string()
        .trim()
        .uri({
            scheme: [
                "http",
                "https",
            ],
        })
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.uri":
                "GitHub URL must be a valid HTTP or HTTPS URL",
            "string.max":
                "GitHub URL cannot exceed 500 characters",
        }),

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

    role: Joi.string()
        .trim()
        .max(255)
        .allow("", null)
        .optional(),
})
    .min(1)
    .custom((value, helpers) => {
        if (
            value.startDate &&
            value.endDate &&
            new Date(value.endDate) <
                new Date(value.startDate)
        ) {
            return helpers.error(
                "any.invalid"
            );
        }

        if (
            value.currentlyWorking === true &&
            value.endDate
        ) {
            return helpers.error(
                "any.invalid"
            );
        }

        return value;
    })
    .messages({
        "object.min":
            "At least one field is required for update",

        "any.invalid":
            "End date cannot be before start date, and a currently working project cannot have an end date",
    });


export {
    createCandidateProjectSchema,
    updateCandidateProjectSchema
};

