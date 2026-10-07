import api from "./api";


// CANDIDATE
export const getCandidateProfile = async () => {

    const response = await api.get(
        "/candidates/profile"
    );

    return response.data;
};


export const updateCandidateProfile = async (
    profileData
) => {

    const response = await api.put(
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

    const response = await api.post(
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

    const response = await api.get(
        "/recruiters/profile"
    );

    return response.data;
};


export const updateRecruiterProfile = async (
    profileData
) => {

    const response = await api.put(
        "/recruiters/profile",
        profileData
    );

    return response.data;
};


export const getMyCompany = async () => {

    const response = await api.get(
        "/companies/my"
    );

    return response.data;
};


export const updateMyCompany = async (
    companyData
) => {

    const response = await api.put(
        "/companies/my",
        companyData
    );

    return response.data;
};