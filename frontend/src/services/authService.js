import api from "./api";

const registerUser = async (userData) => {
    const response = await api.post(
        "/auth/register",
        userData
    );
    return response.data;
};

const loginUser = async (credentials) => {
    const response = await api.post(
        "/auth/login",
        credentials
    );
    return response.data;
};

const forgotPassword = async (email) => {
    const response = await api.post(
        "/auth/forgot-password",
        { email }
    );
    return response.data;
};

const resetPassword = async (token, password) => {
    const response = await api.post(
        "/auth/reset-password",
        { token, password }
    );
    return response.data;
};

export {
    forgotPassword, loginUser,
    registerUser, resetPassword
};
