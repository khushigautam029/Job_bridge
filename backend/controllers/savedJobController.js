import {
    getMySavedJobs,
    isJobSaved,
    removeSavedJob,
    saveJob,
} from "../services/savedJobService.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
    sendSuccess,
} from "../utils/responseHandler.js";

import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

// SAVE A JOB
const save = asyncHandler(
    async (req, res) => {

        const savedJob =
            await saveJob(
                req.user.id,
                req.params.jobId
            );

        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.JOB_SAVED,
            {
                savedJob,
            }
        );
    }
);

// GET MY SAVED JOBS
const getMine = asyncHandler(
    async (req, res) => {

        const savedJobs =
            await getMySavedJobs(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.SAVED_JOBS_FETCHED,
            {
                savedJobs,
            }
        );
    }
);

// CHECK WHETHER JOB IS SAVED
const checkSaved = asyncHandler(
    async (req, res) => {

        const saved =
            await isJobSaved(
                req.user.id,
                req.params.jobId
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOB_SAVED_STATUS_FETCHED,
            {
                saved,
            }
        );
    }
);

// REMOVE SAVED JOB
const remove = asyncHandler(
    async (req, res) => {

        await removeSavedJob(
            req.user.id,
            req.params.jobId
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOB_REMOVED
        );
    }
);

export {
    checkSaved,
    getMine,
    remove,
    save
};
