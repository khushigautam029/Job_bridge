import bcrypt from "bcryptjs";

import {
    CandidateProfile,
    Company,
    RecruiterProfile,
    User,
} from "../models/index.js";

import { STATUS_CODES } from "../utils/setConstants.js";

const registerUser = async ({
    name,
    email,
    password,
    phone,
    role = "CANDIDATE",
    companyName,
}) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        const error = new Error("Email is already registered");
        error.statusCode = STATUS_CODES.CONFLICT;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || null,
        role,
    });

    if (role === "CANDIDATE") {
        await CandidateProfile.create({
            userId: user.id,
        });
    }

    if (role === "RECRUITER") {
        const company = await Company.create({
            name: companyName.trim(),
        });

        await RecruiterProfile.create({
            userId: user.id,
            companyId: company.id,
        });
    }

    return user;
};

const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        where: {
            email: normalizedEmail,
        },
    });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error("Your account is inactive");
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }

    return user;
};

export {
    loginUser,
    registerUser
};
