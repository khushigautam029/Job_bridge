import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};


// CANDIDATE
export const getCandidateProfile = async () => {

    const response = await axios.get(
        `${API_URL}/api/candidates/profile`,
        getAuthConfig()
    );

    return response.data;
};


export const updateCandidateProfile = async (
    profileData
) => {

    const response = await axios.put(
        `${API_URL}/api/candidates/profile`,
        profileData,
        getAuthConfig()
    );

    return response.data;
};


export const uploadCandidateResume = async (
    file
) => {

    const formData = new FormData();

    formData.append(
        "resume",
        file
    );

    const response = await axios.post(
        `${API_URL}/api/candidates/profile/resume`,
        formData,
        {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

// RECRUITER
export const getRecruiterProfile = async () => {

    const response = await axios.get(
        `${API_URL}/api/recruiters/profile`,
        getAuthConfig()
    );

    return response.data;
};


export const updateRecruiterProfile = async (
    profileData
) => {

    const response = await axios.put(
        `${API_URL}/api/recruiters/profile`,
        profileData,
        getAuthConfig()
    );

    return response.data;
};


export const getMyCompany = async () => {

    const response = await axios.get(
        `${API_URL}/api/companies/my`,
        getAuthConfig()
    );

    return response.data;
};


export const updateMyCompany = async (
    companyData
) => {

    const response = await axios.put(
        `${API_URL}/api/companies/my`,
        companyData,
        getAuthConfig()
    );

    return response.data;
};