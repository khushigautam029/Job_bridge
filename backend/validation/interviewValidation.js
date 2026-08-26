import Joi from "joi";


const createInterviewSchema = Joi.object({

    scheduledAt: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Please provide a valid interview date",
            "any.required": "Interview date is required",
        }),

    interviewType: Joi.string()
        .valid(
            "ONLINE",
            "OFFLINE",
            "PHONE"
        )
        .required()
        .messages({
            "any.only": "Invalid interview type",
            "any.required": "Interview type is required",
        }),

    meetingLink: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow(null, "")
        .optional(),

    location: Joi.string()
        .trim()
        .max(255)
        .allow(null, "")
        .optional(),

    notes: Joi.string()
        .trim()
        .max(5000)
        .allow(null, "")
        .optional(),

});


const updateInterviewSchema = Joi.object({

    scheduledAt: Joi.date()
        .iso()
        .optional(),

    interviewType: Joi.string()
        .valid(
            "ONLINE",
            "OFFLINE",
            "PHONE"
        )
        .optional(),

    meetingLink: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow(null, "")
        .optional(),

    location: Joi.string()
        .trim()
        .max(255)
        .allow(null, "")
        .optional(),

    notes: Joi.string()
        .trim()
        .max(5000)
        .allow(null, "")
        .optional(),

}).min(1);


const updateInterviewStatusSchema =
    Joi.object({

        status: Joi.string()
            .valid(
                "SCHEDULED",
                "COMPLETED",
                "CANCELLED",
                "RESCHEDULED"
            )
            .required()
            .messages({
                "any.only":
                    "Invalid interview status",

                "any.required":
                    "Interview status is required",
            }),

    });


export {
    createInterviewSchema,
    updateInterviewSchema,
    updateInterviewStatusSchema
};
