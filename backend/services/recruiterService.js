import {
    Company,
    RecruiterProfile,
    User,
} from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";


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
            "Recruiter profile not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return recruiterProfile;
};


const updateRecruiterProfile = async (
    userId,
    data
) => {

    const recruiterProfile =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiterProfile) {
        const error = new Error(
            "Recruiter profile not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    await recruiterProfile.update({
        designation:
            data.designation ??
            recruiterProfile.designation,

        phone:
            data.phone ??
            recruiterProfile.phone,
    });

    return getRecruiterProfile(userId);
};


export {
    getRecruiterProfile,
    updateRecruiterProfile
};
