import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

const updateCandidateProfileSchema = Joi.object({

    /*
        User fields
    */

    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    phone: Joi.string()
        .trim()
        .max(15)
        .allow("")
        .optional(),


    /*
        Basic candidate profile
    */

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


    /*
        Education / personal details
    */

    degree: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional(),

    college: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional(),

    gender: Joi.string()
        .trim()
        .max(50)
        .allow("")
        .optional(),

    dob: Joi.date()
        .iso()
        .allow("")
        .optional(),


    /*
        Social links
    */

    linkedinUrl: Joi.string()
        .trim()
        .uri()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.uri":
                MESSAGES.PROVIDE_VALID_URL,
        }),

    githubUrl: Joi.string()
        .trim()
        .uri()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.uri":
                MESSAGES.PROVIDE_A_VALID_GITHUB_URL,
        }),

    portfolioUrl: Joi.string()
        .trim()
        .uri()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.uri":
                MESSAGES.PROVIDE_A_VALID_PORTFOLIO_URL,
        }),


    /*
        Experience
    */

    experienceYears: Joi.number()
        .min(0)
        .max(99.9)
        .precision(1)
        .optional(),


    /*
        Career preferences

        Both fields are arrays because
        candidates can select multiple values.
    */

    preferredJobType: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(100)
        )
        .max(20)
        .optional(),

    preferredLocation: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(150)
        )
        .max(20)
        .optional(),

    availability: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .optional(),

}).min(1);

export {
    updateCandidateProfileSchema
};

