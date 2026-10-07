import api from "./api";

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
        title: job.title || "",
        company: job.company?.name || "Company",
        category: job.category?.name || "",
        location: job.location || "",
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
    getData(await api.get("/jobs", { params: filters }));

export const getJob = async (jobId) =>
    getData(await api.get(`/jobs/${jobId}`)).job;

export const getMyJobs = async () =>
    getData(await api.get("/jobs/my")).jobs;

export const getJobCategories = async () =>
    (await api.get("/jobs/categories")).data.data.categories;

export const getSkills = async () =>
    (await api.get("/skills")).data.data.skills;

export const createJob = async (job) =>
    getData(await api.post("/jobs", job));

export const updateJob = async (jobId, job) =>
    getData(await api.put(`/jobs/${jobId}`, job));

export const deleteJob = async (jobId) =>
    api.delete(`/jobs/${jobId}`);

export const getApplications = async () =>
    (await api.get("/applications/my-applications")).data.data.applications;

export const getRecruiterApplications = async () =>
    (await api.get("/applications/recruiter")).data.data.applications;

export const getJobApplications = async (jobId) =>
    (await api.get(`/jobs/${jobId}/applications`)).data.data.applications;

export const applyForJob = async (jobId, application) =>
    getData(await api.post(
        `/jobs/${jobId}/apply`,
        application
    ));

export const withdrawApplication = async (applicationId) =>
    api.delete(`/applications/${applicationId}`);

export const updateApplicationStatus = async (
    applicationId,
    status
) =>
    getData(await api.patch(
        `/applications/${applicationId}/status`,
        { status }
    ));

export const getSavedJobs = async () =>
    (await api.get("/saved-jobs")).data.data.savedJobs;

export const saveJob = async (jobId) =>
    api.post(`/jobs/${jobId}/save`);

export const unsaveJob = async (jobId) =>
    api.delete(`/jobs/${jobId}/save`);

export const isJobSaved = async (jobId) =>
    (await api.get(`/jobs/${jobId}/is-saved`)).data.data.saved;

export const getInterviews = async () =>
    (await api.get("/interviews/my-interviews")).data.data.interviews;

export const getRecruiterInterviews = async () =>
    (await api.get("/interviews/recruiter")).data.data.interviews;

export const scheduleInterview = async (applicationId, interview) =>
    getData(await api.post(
        `/applications/${applicationId}/interviews`,
        interview
    ));

export const updateInterviewStatus = async (interviewId, status) =>
    getData(await api.patch(
        `/interviews/${interviewId}/status`,
        { status }
    ));

export const cancelInterview = async (interviewId) =>
    api.delete(`/interviews/${interviewId}`);

export const getNotifications = async () =>
    (await api.get("/notifications")).data.data.notifications;

export const getUnreadNotificationCount = async () =>
    (await api.get("/notifications/unread-count")).data.data.unreadCount;

export const markNotificationRead = async (notificationId) =>
    api.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = async () =>
    api.patch("/notifications/read-all");

export const deleteNotification = async (notificationId) =>
    api.delete(`/notifications/${notificationId}`);

export const getCurrentUser = async () =>
    getData(await api.get("/users/me"));

export const updateCurrentUser = async (profile) =>
    getData(await api.put("/users/profile", profile));

export const changePassword = async (passwords) =>
    api.put("/users/change-password", passwords);

export const deleteAccount = async () =>
    api.delete("/users/account");
