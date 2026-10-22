
import api from "./api";

const getData = (response) => response.data.data;

// Candidate application services
export const getApplications = async () =>
    getData(
        await api.get("/applications/my-applications")
    ).applications;

// Recruiter application services
export const getRecruiterApplications = async () =>
    getData(
        await api.get("/applications/recruiter")
    ).applications;

// Get applications for a particular job
export const getJobApplications = async (jobId) =>
    getData(
        await api.get(`/jobs/${jobId}/applications`)
    ).applications;

// Apply for a job
export const applyForJob = async (jobId, application) =>
    getData(
        await api.post(
            `/jobs/${jobId}/apply`,
            application
        )
    );

// Withdraw an application
export const withdrawApplication = async (applicationId) =>
    api.delete(`/applications/${applicationId}`);

// Update application status
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

// Run ATS analysis for a job's applications in batches
export const runJobAtsAnalysis = async (
    jobId,
    afterApplicationId = 0
) =>
    getData(
        await api.post(
            `/jobs/${jobId}/ats-analysis`,
            { afterApplicationId }
        )
    );

// Get ATS-ranked applicants for a particular job
export const getRankedJobApplications = async (
    jobId,
    page = 1,
    limit = 50
) =>
    getData(
        await api.get(
            `/jobs/${jobId}/ats-ranked-applicants`,
            {
                params: { page, limit },
            }
        )
    );
