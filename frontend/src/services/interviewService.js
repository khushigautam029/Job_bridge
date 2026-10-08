import api from "./api";

const getData = (response) => response.data.data;

export const getInterviews = async () =>
    getData(
        await api.get("/interviews/my-interviews")
    ).interviews;

export const getRecruiterInterviews = async () =>
    getData(
        await api.get("/interviews/recruiter")
    ).interviews;

export const scheduleInterview = async (
    applicationId,
    interview
) =>
    getData(
        await api.post(
            `/applications/${applicationId}/interviews`,
            interview
        )
    );

export const updateInterviewStatus = async (
    interviewId,
    status
) =>
    getData(
        await api.patch(
            `/interviews/${interviewId}/status`,
            { status }
        )
    );

export const cancelInterview = async (interviewId) =>
    api.delete(`/interviews/${interviewId}`);

export const getInterview = async (interviewId) =>
    getData(
        await api.get(`/interviews/${interviewId}`)
    );

export const updateInterview = async (
    interviewId,
    interview
) =>
    getData(
        await api.patch(
            `/interviews/${interviewId}`,
            interview
        )
    );