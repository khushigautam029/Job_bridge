import {
    CandidateProfile,
    Company,
    RecruiterProfile,
    User,
} from "../models/index.js";
import {
    comparePassword,
    hashPassword,
} from "../utils/password.js";
import { STATUS_CODES } from "../utils/setConstants.js";

const getUserById = async (userId) => {
    const user = await User.findByPk(
        userId,
        {
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: CandidateProfile,
                    as: "candidateProfile",
                    required: false,
                },
                {
                    model: RecruiterProfile,
                    as: "recruiterProfile",
                    required: false,
                    include: [
                        {
                            model: Company,
                            as: "company",
                            required: false,
                        },
                    ],
                },
            ],
        }
    );

    if (!user) {
        const error = new Error(
            "User not found"
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return user;
};


const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findByPk(userId);
    if (!user) {
        const error = new Error(
            "User not found"
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const isPasswordValid =
        await comparePassword(
            currentPassword,
            user.password
        );

    if (!isPasswordValid) {
        const error = new Error(
            "Current password is incorrect"
        );
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const hashedPassword =
        await hashPassword(
            newPassword
        );

    await user.update({
        password: hashedPassword,
    });
    return true;
};

const deleteAccount = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        const error = new Error(
            "User not found"
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    await user.destroy();
    return true;
};


export {
    changePassword,
    deleteAccount,
    getUserById
};

