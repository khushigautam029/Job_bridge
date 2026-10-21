import {
    CandidateEducation,
    CandidateProfile,
} from "../models/index.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

// GET CANDIDATE PROFILE
const findCandidateProfile = async (
    userId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidate) {
        const error = new Error(
            MESSAGES.PROFILE_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return candidate;
};


// GET ALL EDUCATION RECORDS
const getCandidateEducations = async (
    userId
) => {

    const candidate =
        await findCandidateProfile(
            userId
        );


    const educations =
        await CandidateEducation.findAll({
            where: {
                candidateId:
                    candidate.id,
            },

            order: [
                ["startDate", "DESC"],
                ["id", "DESC"],
            ],
        });


    return educations;
};

// GET EDUCATION BY ID
const getCandidateEducationById = async (
    userId,
    educationId
) => {

    const candidate =
        await findCandidateProfile(
            userId
        );


    const education =
        await CandidateEducation.findOne({
            where: {
                id: educationId,

                candidateId:
                    candidate.id,
            },
        });


    if (!education) {
        const error = new Error(
            MESSAGES.EDUCATION_RECORD_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    return education;
};

// ADD EDUCATION
const addCandidateEducation = async (
    userId,
    data
) => {

    const candidate =
        await findCandidateProfile(
            userId
        );


    const education =
        await CandidateEducation.create({
            candidateId:
                candidate.id,

            degree:
                data.degree,

            fieldOfStudy:
                data.fieldOfStudy,

            institution:
                data.institution,

            location:
                data.location,

            startDate:
                data.startDate,

            endDate:
                data.endDate,

            grade:
                data.grade,

            description:
                data.description,
        });


    return education;
};

// UPDATE EDUCATION
const updateCandidateEducation = async (
    userId,
    educationId,
    data
) => {

    const candidate =
        await findCandidateProfile(
            userId
        );


    const education =
        await CandidateEducation.findOne({
            where: {
                id: educationId,

                candidateId:
                    candidate.id,
            },
        });


    if (!education) {
        const error = new Error(
            MESSAGES.EDUCATION_RECORD_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    await education.update(data);


    return education;
};


// DELETE EDUCATION
const deleteCandidateEducation = async (
    userId,
    educationId
) => {

    const candidate =
        await findCandidateProfile(
            userId
        );


    const education =
        await CandidateEducation.findOne({
            where: {
                id: educationId,

                candidateId:
                    candidate.id,
            },
        });


    if (!education) {
        const error = new Error(
            MESSAGES.EDUCATION_RECORD_NOT_FOUND
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    await education.destroy();


    return educationId;
};


export {
    addCandidateEducation, deleteCandidateEducation, getCandidateEducationById, getCandidateEducations, updateCandidateEducation
};

