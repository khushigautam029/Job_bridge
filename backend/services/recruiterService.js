import {
    Company,
    RecruiterProfile,
    User,
} from "../models/index.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";


const getRecruiterProfile = async (userId) => {
    const recruiterProfile = await RecruiterProfile.findOne({
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
                    "role",
                ],
            },
            {
                model: Company,
                as: "company",
            },
        ],
    });

    if (!recruiterProfile) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return recruiterProfile;
};


const updateRecruiterProfile = async (userId, data) => {
    const recruiterProfile = await RecruiterProfile.findOne({
        where: {
            userId,
        },
    });

    if (!recruiterProfile) {
        const error = new Error( MESSAGES.RECRUITER_PROFILE_NOT_FOUND );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error(MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    await user.update({
        name: data.name ?? user.name,
        phone: data.phone ?? user.phone,
    });

    await recruiterProfile.update({
        designation:
            data.designation ??
            recruiterProfile.designation,
    });

    return getRecruiterProfile(userId);
};

export {
    getRecruiterProfile,
    updateRecruiterProfile
};
