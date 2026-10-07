import api from "./api";

const getData = (response) => response.data.data;

export const getApplications = async () =>
    getData(await api.get("/applications/my-applications")).applications;

export const getRecruiterApplications = async () =>
    getData(await api.get("/applications/recruiter")).applications;

export const getJobApplications = async (jobId) =>
    getData(
        await api.get(`/jobs/${jobId}/applications`)
    ).applications;

export const applyForJob = async (jobId, application) =>
    getData(
        await api.post(
            `/jobs/${jobId}/apply`,
            application
        )
    );

export const withdrawApplication = async (applicationId) =>
    api.delete(`/applications/${applicationId}`);

export const updateApplicationStatus = async (
    applicationId,
    status
) =>
    getData(
        await api.patch(
            `/applications/${applicationId}/status`,
            { status }
        )
    );