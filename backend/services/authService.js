import bcrypt from "bcryptjs";
import {
    CandidateProfile,
    Company,
    RecruiterProfile,
    User,
} from "../models/index.js";

const registerUser = async ({
        name,
        email,
        password,
        phone,
        role,
        companyName,
    }) => {
    const existingUser = await User.findOne({
        where: { email },
    });

    if (existingUser) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role,
    });
    if (role === "CANDIDATE") {
        await CandidateProfile.create({
            userId: user.id,
        });
    } else if (role === "RECRUITER") {
        const company = await Company.create({
            name: companyName,
        });
        await RecruiterProfile.create({
            userId: user.id,
            companyId: company.id,
        });
    }
    return user;
};


const loginUser = async ({ email, password }) => {
    const user = await User.findOne({
        where: { email },
    });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    if (!user.isActive) {
        const error = new Error("Your account is inactive");
        error.statusCode = 403;
        throw error;
    }
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );
    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    return user;
};


export {
    loginUser, registerUser
};
