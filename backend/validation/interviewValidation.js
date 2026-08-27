import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";


const createInterviewSchema = Joi.object({

    scheduledAt: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": MESSAGES.VALID_INTERVIEW_DATE,
            "any.required": MESSAGES.INTERVIEW_DATE_REQUIRED,
        }),

    interviewType: Joi.string()
        .valid(
            "ONLINE",
            "OFFLINE",
            "PHONE"
        )
        .required()
        .messages({
            "any.only": MESSAGES.INVALID_INTERVIEW_TYPE,
            "any.required": MESSAGES.INTERVIEW_TYPE_REQUIRED,
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
                    MESSAGES.INVALID_INTERVIEW_STATUS,

                "any.required":
                   MESSAGES.INTERVIEW_STATUS_REQUIRED,
            }),

    });


export {
    createInterviewSchema,
    updateInterviewSchema,
    updateInterviewStatusSchema
};
