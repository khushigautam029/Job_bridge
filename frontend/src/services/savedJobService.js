import api from "./api";

export const getSavedJobs = async () =>
    (await api.get("/saved-jobs")).data.data.savedJobs;

export const saveJob = async (jobId) =>
    api.post(`/jobs/${jobId}/save`);

export const unsaveJob = async (jobId) =>
    api.delete(`/jobs/${jobId}/save`);

export const isJobSaved = async (jobId) =>
    (await api.get(`/jobs/${jobId}/is-saved`)).data.data.saved;