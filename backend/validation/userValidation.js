import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";


const updateProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .optional()
        .allow("")
        .messages({
            "string.pattern.base":
                MESSAGES.PROVIDE_VALID_PHONE_NO,
        }),
}).min(1);


const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required(),

    newPassword: Joi.string()
        .min(8)
        .max(100)
        .required(),
}).required();

const userPreferencesSchema = Joi.object({
    notificationSettings: Joi.object({
        jobAlerts: Joi.boolean(),
        applicationUpdates: Joi.boolean(),
        interviewReminders: Joi.boolean(),
        applicationAlerts: Joi.boolean(),
        interviewUpdates: Joi.boolean(),
        newCandidateAlerts: Joi.boolean(),
        emailNotifications: Joi.boolean(),
    }).min(1),
    privacySettings: Joi.object({
        profileVisibility: Joi.boolean(),
        resumeVisibility: Joi.boolean(),
        companyVisibility: Joi.boolean(),
    }).min(1),
}).min(1).required();


export {
    changePasswordSchema, updateProfileSchema, userPreferencesSchema
};
