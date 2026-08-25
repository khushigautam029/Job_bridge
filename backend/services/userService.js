import bcrypt from "bcryptjs";

import {
    CandidateProfile,
    Company,
    RecruiterProfile,
    User,
} from "../models/index.js";


const getUserById = async (userId) => {

    const user = await User.findByPk(userId, {
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
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};


const updateUserProfile = async (userId, data) => {

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    await user.update({
        name: data.name ?? user.name,
        phone: data.phone ?? user.phone,
    });

    return getUserById(userId);
};


const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        12
    );

    await user.update({
        password: hashedPassword,
    });

    return true;
};


const deleteAccount = async (userId) => {

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    await user.destroy();

    return true;
};


export {
    changePassword,
    deleteAccount, getUserById,
    updateUserProfile
};
