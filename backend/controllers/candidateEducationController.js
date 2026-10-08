import {
    addCandidateEducation,
    deleteCandidateEducation,
    getCandidateEducationById,
    getCandidateEducations,
    updateCandidateEducation,
} from "../services/candidateEducationService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    STATUS_CODES,
} from "../utils/setConstants.js";
import {
    createCandidateEducationSchema,
    updateCandidateEducationSchema,
} from "../validation/candidateEducationValidation.js";


// GET ALL EDUCATION
const getEducations = asyncHandler(
    async (req, res) => {

        const educations =
            await getCandidateEducations(
                req.user.id
            );


        res.status(
            STATUS_CODES.OK
        ).json({

            success: true,

            data: {
                educations,
            },

        });
    }
);

// GET EDUCATION BY ID
const getEducation = asyncHandler(
    async (req, res) => {

        const {
            educationId,
        } = req.params;


        const education =
            await getCandidateEducationById(
                req.user.id,
                Number(educationId)
            );


        res.status(
            STATUS_CODES.OK
        ).json({

            success: true,

            data: {
                education,
            },

        });
    }
);


// ADD EDUCATION
const addEducation = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } =
            createCandidateEducationSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );


        if (error) {

            return res.status(
                STATUS_CODES.BAD_REQUEST
            ).json({

                success: false,

                message:
                    "Validation failed",

                errors:
                    error.details.map(
                        (detail) =>
                            detail.message
                    ),

            });
        }


        const education =
            await addCandidateEducation(
                req.user.id,
                value
            );


        res.status(
            STATUS_CODES.CREATED
        ).json({

            success: true,

            message:
                "Education added successfully",

            data: {
                education,
            },

        });
    }
);

// UPDATE EDUCATION
const updateEducation = asyncHandler(
    async (req, res) => {

        const {
            educationId,
        } = req.params;


        const {
            error,
            value,
        } =
            updateCandidateEducationSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );


        if (error) {

            return res.status(
                STATUS_CODES.BAD_REQUEST
            ).json({

                success: false,

                message:
                    "Validation failed",

                errors:
                    error.details.map(
                        (detail) =>
                            detail.message
                    ),

            });
        }


        const education =
            await updateCandidateEducation(
                req.user.id,
                Number(educationId),
                value
            );


        res.status(
            STATUS_CODES.OK
        ).json({

            success: true,

            message:
                "Education updated successfully",

            data: {
                education,
            },

        });
    }
);

// DELETE EDUCATION
const deleteEducation = asyncHandler(
    async (req, res) => {

        const {
            educationId,
        } = req.params;


        await deleteCandidateEducation(
            req.user.id,
            Number(educationId)
        );


        res.status(
            STATUS_CODES.OK
        ).json({

            success: true,

            message:
                "Education deleted successfully",

        });
    }
);


export {
    addEducation, deleteEducation, getEducation, getEducations, updateEducation
};

