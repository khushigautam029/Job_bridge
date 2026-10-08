import api from "./api";

// CANDIDATE PROFILE
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

// CANDIDATE RESUME
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
        formData
    );

    return response.data;
};


export const deleteCandidateResume = async () => {
    const response = await api.delete(
        "/candidates/profile/resume"
    );

    return response.data;
};

// CANDIDATE PROFILE IMAGE
export const uploadCandidateProfileImage = async (
    file
) => {
    const formData = new FormData();

    formData.append(
        "profileImage",
        file
    );

    const response = await api.post(
        "/candidates/profile/image",
        formData
    );

    return response.data;
};


export const deleteCandidateProfileImage = async () => {
    const response = await api.delete(
        "/candidates/profile/image"
    );

    return response.data;
};


// CANDIDATE SKILLS
export const getCandidateSkills = async () => {
    const response = await api.get(
        "/candidates/skills"
    );

    return response.data;
};


export const addCandidateSkill = async (
    skillId
) => {
    const response = await api.post(
        "/candidates/skills",
        {
            skillId,
        }
    );

    return response.data;
};


export const deleteCandidateSkill = async (
    skillId
) => {
    const response = await api.delete(
        `/candidates/skills/${skillId}`
    );

    return response.data;
};

// CANDIDATE EDUCATION
export const getCandidateEducation = async () => {
    const response = await api.get(
        "/candidate/education"
    );

    return response.data;
};


export const getCandidateEducationById = async (
    educationId
) => {
    const response = await api.get(
        `/candidate/education/${educationId}`
    );

    return response.data;
};


export const addCandidateEducation = async (
    educationData
) => {
    const response = await api.post(
        "/candidate/education",
        educationData
    );

    return response.data;
};


export const updateCandidateEducation = async (
    educationId,
    educationData
) => {
    const response = await api.put(
        `/candidate/education/${educationId}`,
        educationData
    );

    return response.data;
};


export const deleteCandidateEducation = async (
    educationId
) => {
    const response = await api.delete(
        `/candidate/education/${educationId}`
    );

    return response.data;
};

// CANDIDATE EXPERIENCE / INTERNSHIPS
export const getCandidateExperiences = async () => {
    const response = await api.get(
        "/candidate/experience"
    );

    return response.data;
};


export const getCandidateExperienceById = async (
    experienceId
) => {
    const response = await api.get(
        `/candidate/experience/${experienceId}`
    );

    return response.data;
};


export const addCandidateExperience = async (
    experienceData
) => {
    const response = await api.post(
        "/candidate/experience",
        experienceData
    );

    return response.data;
};


export const updateCandidateExperience = async (
    experienceId,
    experienceData
) => {
    const response = await api.put(
        `/candidate/experience/${experienceId}`,
        experienceData
    );

    return response.data;
};


export const deleteCandidateExperience = async (
    experienceId
) => {
    const response = await api.delete(
        `/candidate/experience/${experienceId}`
    );

    return response.data;
};

// CANDIDATE PROJECTS
export const getCandidateProjects = async () => {
    const response = await api.get(
        "/candidate/projects"
    );

    return response.data;
};


export const getCandidateProjectById = async (
    projectId
) => {
    const response = await api.get(
        `/candidate/projects/${projectId}`
    );

    return response.data;
};


export const addCandidateProject = async (
    projectData
) => {
    const response = await api.post(
        "/candidate/projects",
        projectData
    );

    return response.data;
};


export const updateCandidateProject = async (
    projectId,
    projectData
) => {
    const response = await api.put(
        `/candidate/projects/${projectId}`,
        projectData
    );

    return response.data;
};


export const deleteCandidateProject = async (
    projectId
) => {
    const response = await api.delete(
        `/candidate/projects/${projectId}`
    );

    return response.data;
};

// RECRUITER PROFILE
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
