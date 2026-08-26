import {
    CandidateProfile,
    Job,
    SavedJob,
} from "../models/index.js";


/*
    Save a job
*/
const saveJob = async (
    userId,
    jobId
) => {

    // Find candidate profile
    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });


    if (!candidate) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Check whether job exists
    const job = await Job.findByPk(jobId);


    if (!job) {
        const error = new Error(
            "Job not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Check whether job is open
    if (job.status !== "OPEN") {
        const error = new Error(
            "Only open jobs can be saved"
        );

        error.statusCode = 400;
        throw error;
    }


    // Check whether already saved
    const existingSavedJob =
        await SavedJob.findOne({
            where: {
                candidateId: candidate.id,
                jobId,
            },
        });


    if (existingSavedJob) {
        const error = new Error(
            "Job is already saved"
        );

        error.statusCode = 409;
        throw error;
    }


    // Create saved job
    const savedJob =
        await SavedJob.create({
            candidateId: candidate.id,
            jobId,
        });


    return savedJob;
};


/*
    Get all saved jobs
*/
const getMySavedJobs = async (
    userId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });


    if (!candidate) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode = 404;
        throw error;
    }


    const savedJobs =
        await SavedJob.findAll({

            where: {
                candidateId: candidate.id,
            },

            include: [
                {
                    model: Job,
                    as: "job",
                },
            ],

            order: [
                ["createdAt", "DESC"],
            ],
        });


    return savedJobs;
};


/*
    Check whether a job is saved
*/
const isJobSaved = async (
    userId,
    jobId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });


    if (!candidate) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode = 404;
        throw error;
    }


    const savedJob =
        await SavedJob.findOne({
            where: {
                candidateId: candidate.id,
                jobId,
            },
        });


    return !!savedJob;
};


/*
    Remove saved job
*/
const removeSavedJob = async (
    userId,
    jobId
) => {
    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidate) {
        const error = new Error(
            "Candidate profile not found"
        );
        error.statusCode = 404;
        throw error;
    }

    const savedJob =
        await SavedJob.findOne({
            where: {
                candidateId: candidate.id,
                jobId,
            },
        });

    if (!savedJob) {
        const error = new Error(
            "Saved job not found"
        );
        error.statusCode = 404;
        throw error;
    }
    await savedJob.destroy();
};

export {
    getMySavedJobs,
    isJobSaved,
    removeSavedJob, saveJob
};
