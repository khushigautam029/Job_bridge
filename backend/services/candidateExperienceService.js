import {
    CandidateExperience,
    CandidateProfile,
} from "../models/index.js";

import { STATUS_CODES } from "../utils/setConstants.js";

const findCandidateProfile = async (userId) => {
    const candidateProfile = await CandidateProfile.findOne({
        where: {
            userId,
        },
    });

    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return candidateProfile;
};


const getCandidateExperiences = async (userId) => {
    const candidateProfile =
        await findCandidateProfile(userId);

    const experiences =
        await CandidateExperience.findAll({
            where: {
                candidateId: candidateProfile.id,
            },

            order: [
                ["currentlyWorking", "DESC"],
                ["startDate", "DESC"],
                ["id", "DESC"],
            ],
        });

    return experiences;
};


const getCandidateExperienceById = async (
    userId,
    experienceId
) => {
    const candidateProfile =
        await findCandidateProfile(userId);

    const experience =
        await CandidateExperience.findOne({
            where: {
                id: experienceId,
                candidateId: candidateProfile.id,
            },
        });

    if (!experience) {
        const error = new Error(
            "Experience not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return experience;
};


const addCandidateExperience = async (
    userId,
    data
) => {
    const candidateProfile =
        await findCandidateProfile(userId);

    const experience =
        await CandidateExperience.create({
            candidateId: candidateProfile.id,
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            employmentType:
                data.employmentType,
            location: data.location || null,
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            currentlyWorking:
                data.currentlyWorking ?? false,
            description:
                data.description || null,
            skills: data.skills || null,
        });

    return experience;
};


const updateCandidateExperience = async (
    userId,
    experienceId,
    data
) => {
    const experience =
        await getCandidateExperienceById(
            userId,
            experienceId
        );

    await experience.update(data);

    return experience;
};


const deleteCandidateExperience = async (
    userId,
    experienceId
) => {
    const experience =
        await getCandidateExperienceById(
            userId,
            experienceId
        );

    await experience.destroy();

    return {
        experienceId: Number(experienceId),
        message:
            "Experience deleted successfully",
    };
};


export {
    addCandidateExperience, deleteCandidateExperience, getCandidateExperienceById, getCandidateExperiences, updateCandidateExperience
};

