import apiClient from "./apiClient";

const registerUser = async (userData) => {
    const response = await apiClient.post(
        "/auth/register",
        userData
    );
    return response.data;
};

const loginUser = async (credentials) => {
    const response = await apiClient.post(
        "/auth/login",
        credentials
    );
    return response.data;
};

export {
    loginUser,
    registerUser
};
