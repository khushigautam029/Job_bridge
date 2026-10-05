import apiClient from "./apiClient";


// CANDIDATE
export const getCandidateProfile = async () => {

    const response = await apiClient.get(
        "/candidates/profile"
    );

    return response.data;
};


export const updateCandidateProfile = async (
    profileData
) => {

    const response = await apiClient.put(
        "/candidates/profile",
        profileData
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

    const response = await apiClient.post(
        "/candidates/profile/resume",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

// RECRUITER
export const getRecruiterProfile = async () => {

    const response = await apiClient.get(
        "/recruiters/profile"
    );

    return response.data;
};


export const updateRecruiterProfile = async (
    profileData
) => {

    const response = await apiClient.put(
        "/recruiters/profile",
        profileData
    );

    return response.data;
};


export const getMyCompany = async () => {

    const response = await apiClient.get(
        "/companies/my"
    );

    return response.data;
};


export const updateMyCompany = async (
    companyData
) => {

    const response = await apiClient.put(
        "/companies/my",
        companyData
    );

    return response.data;
};