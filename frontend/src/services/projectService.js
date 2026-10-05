import apiClient from "./apiClient";

const getData = (response) => response.data.data;

export const formatJobCard = (job) => {
    const minSalary = Number(job.minSalary || 0);
    const maxSalary = Number(job.maxSalary || 0);
    const salary = minSalary && maxSalary
        ? `₹${minSalary.toLocaleString("en-IN")} - ₹${maxSalary.toLocaleString("en-IN")}`
        : minSalary || maxSalary
            ? `₹${(minSalary || maxSalary).toLocaleString("en-IN")}`
            : "Salary not disclosed";
    const experienceMax = job.experienceMax;
    const experience = experienceMax
        ? `${job.experienceMin || 0}-${experienceMax} Years`
        : `${job.experienceMin || 0}+ Years`;
    const postedDate = job.createdAt
        ? new Date(job.createdAt).toLocaleDateString()
        : "";

    return {
        ...job,
        company: job.company?.name || "Company",
        category: job.category?.name || "",
        type: (job.jobType || "").replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase()),
        workMode: (job.workMode || "").replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase()),
        salary,
        experience,
        posted: postedDate,
        skills: (job.skills || []).map((skill) =>
            typeof skill === "string" ? skill : skill.name
        ),
    };
};

export const getJobs = async (filters = {}) =>
    getData(await apiClient.get("/jobs", { params: filters }));

export const getJob = async (jobId) =>
    getData(await apiClient.get(`/jobs/${jobId}`));

export const getMyJobs = async () =>
    getData(await apiClient.get("/jobs/my"));

export const getJobCategories = async () =>
    (await apiClient.get("/jobs/categories")).data.data.categories;

export const getSkills = async () =>
    (await apiClient.get("/skills")).data.data.skills;

export const createJob = async (job) =>
    getData(await apiClient.post("/jobs", job));

export const updateJob = async (jobId, job) =>
    getData(await apiClient.put(`/jobs/${jobId}`, job));

export const deleteJob = async (jobId) =>
    apiClient.delete(`/jobs/${jobId}`);

export const getApplications = async () =>
    (await apiClient.get("/applications/my-applications")).data.data.applications;

export const getRecruiterApplications = async () =>
    (await apiClient.get("/applications/recruiter")).data.data.applications;

export const getJobApplications = async (jobId) =>
    (await apiClient.get(`/jobs/${jobId}/applications`)).data.data.applications;

export const applyForJob = async (jobId, application) =>
    getData(await apiClient.post(
        `/jobs/${jobId}/apply`,
        application
    ));

export const withdrawApplication = async (applicationId) =>
    apiClient.delete(`/applications/${applicationId}`);

export const updateApplicationStatus = async (
    applicationId,
    status
) =>
    getData(await apiClient.patch(
        `/applications/${applicationId}/status`,
        { status }
    ));

export const getSavedJobs = async () =>
    (await apiClient.get("/saved-jobs")).data.data.savedJobs;

export const saveJob = async (jobId) =>
    apiClient.post(`/jobs/${jobId}/save`);

export const unsaveJob = async (jobId) =>
    apiClient.delete(`/jobs/${jobId}/save`);

export const isJobSaved = async (jobId) =>
    (await apiClient.get(`/jobs/${jobId}/is-saved`)).data.data.saved;

export const getInterviews = async () =>
    (await apiClient.get("/interviews/my-interviews")).data.data.interviews;

export const getRecruiterInterviews = async () =>
    (await apiClient.get("/interviews/recruiter")).data.data.interviews;

export const scheduleInterview = async (applicationId, interview) =>
    getData(await apiClient.post(
        `/applications/${applicationId}/interviews`,
        interview
    ));

export const updateInterviewStatus = async (interviewId, status) =>
    getData(await apiClient.patch(
        `/interviews/${interviewId}/status`,
        { status }
    ));

export const cancelInterview = async (interviewId) =>
    apiClient.delete(`/interviews/${interviewId}`);

export const getNotifications = async () =>
    (await apiClient.get("/notifications")).data.data.notifications;

export const getUnreadNotificationCount = async () =>
    (await apiClient.get("/notifications/unread-count")).data.data.unreadCount;

export const markNotificationRead = async (notificationId) =>
    apiClient.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = async () =>
    apiClient.patch("/notifications/read-all");

export const deleteNotification = async (notificationId) =>
    apiClient.delete(`/notifications/${notificationId}`);

export const getCurrentUser = async () =>
    getData(await apiClient.get("/users/me"));

export const updateCurrentUser = async (profile) =>
    getData(await apiClient.put("/users/profile", profile));

export const changePassword = async (passwords) =>
    apiClient.put("/users/change-password", passwords);

export const deleteAccount = async () =>
    apiClient.delete("/users/account");
