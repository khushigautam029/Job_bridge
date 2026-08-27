import asyncHandler from "../utils/asyncHandler.js";

import {
    getMySavedJobs,
    isJobSaved,
    removeSavedJob,
    saveJob,
} from "../services/savedJobService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

// Save a job
const save = asyncHandler(
    async (req, res) => {
        const savedJob =
            await saveJob(
                req.user.id,
                req.params.jobId
            );
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.JOB_SAVED,
            data: {
                savedJob,
            },
        });
    }
);

// Get my saved jobs
const getMine = asyncHandler(
    async (req, res) => {
        const savedJobs =
            await getMySavedJobs(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                savedJobs,
            },
        });
    }
);

// Check whether job is saved
const checkSaved = asyncHandler(
    async (req, res) => {
        const saved =
            await isJobSaved(
                req.user.id,
                req.params.jobId
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                saved,
            },
        });
    }
);

//  Remove saved job
const remove = asyncHandler(
    async (req, res) => {
        await removeSavedJob(
            req.user.id,
            req.params.jobId
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.JOB_REMOVED,
        });
    }
);


export {
    checkSaved, getMine, remove, save
};
