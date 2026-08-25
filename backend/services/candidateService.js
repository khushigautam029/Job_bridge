import {
    CandidateProfile,
    User,
} from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";


const getCandidateProfile = async (userId) => {
    const candidateProfile =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "phone",
                        "role",
                    ],
                },
            ],
        });

    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    return candidateProfile;
};


const updateCandidateProfile = async (
    userId,
    data
) => {
    const candidateProfile =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });
    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    await candidateProfile.update(data);
    return getCandidateProfile(userId);
};


export {
    getCandidateProfile,
    updateCandidateProfile
};
