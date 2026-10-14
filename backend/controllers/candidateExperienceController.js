import {
    addCandidateExperience,
    deleteCandidateExperience,
    getCandidateExperienceById,
    getCandidateExperiences,
    updateCandidateExperience,
} from "../services/candidateExperienceService.js";

import {
    sendSuccess,
} from "../utils/responseHandler.js";

import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";


const getExperiences = async (req, res) => {
    const experiences =
        await getCandidateExperiences(
            req.user.id
        );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EXPERIENCES_FETCHED,
        {
            experiences,
        }
    );
};


const getExperience = async (req, res) => {
    const experience =
        await getCandidateExperienceById(
            req.user.id,
            req.params.experienceId
        );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EXPERIENCES_FETCHED,
        {
            experience,
        }
    );
};


const createExperience = async (req, res) => {
    const experience =
        await addCandidateExperience(
            req.user.id,
            req.body
        );

    return sendSuccess(
        res,
        STATUS_CODES.CREATED,
        MESSAGES.EXPERIENCE_ADDED,
        {
            experience,
        }
    );
};


const updateExperience = async (req, res) => {
    const experience =
        await updateCandidateExperience(
            req.user.id,
            req.params.experienceId,
            req.body
        );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EXPERIENCE_UPDATED,
        {
            experience,
        }
    );
};


const deleteExperience = async (req, res) => {
    const result =
        await deleteCandidateExperience(
            req.user.id,
            req.params.experienceId
        );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        result.message,
        {
            experienceId:
                result.experienceId,
        }
    );
};


export {
    createExperience, deleteExperience, getExperience, getExperiences, updateExperience
};

