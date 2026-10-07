import api from "./api";

const getData = (response) => response.data.data;

export const formatJobCard = (job) => {
    const minSalary = Number(job.minSalary || 0);
    const maxSalary = Number(job.maxSalary || 0);

    const salary =
        minSalary && maxSalary
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

        type: (job.jobType || "")
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase()),

        workMode: (job.workMode || "")
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase()),

        salary,
        experience,
        posted: postedDate,

        skills: (job.skills || []).map((skill) =>
            typeof skill === "string"
                ? skill
                : skill.name
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