import asyncHandler from "../utils/asyncHandler.js";

import {
    applyForJob,
    getApplicationById,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    withdrawApplication,
} from "../services/applicationService.js";

import {
    createApplicationSchema,
    updateApplicationStatusSchema,
} from "../validation/applicationValidation.js";


/*
    Candidate → Apply for job
*/
const apply = asyncHandler(
    async (req, res) => {

        const { error, value } =
            createApplicationSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );


        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }


        const application =
            await applyForJob(
                req.user.id,
                req.params.jobId,
                value
            );


        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: {
                application,
            },
        });
    }
);


/*
    Candidate → My applications
*/
const getMine = asyncHandler(
    async (req, res) => {

        const applications =
            await getMyApplications(
                req.user.id
            );


        res.status(200).json({
            success: true,
            data: {
                applications,
            },
        });
    }
);


/*
    Candidate / Recruiter → One application
*/
const getOne = asyncHandler(
    async (req, res) => {

        const application =
            await getApplicationById(
                req.user.id,
                req.params.id
            );


        res.status(200).json({
            success: true,
            data: {
                application,
            },
        });
    }
);


/*
    Candidate → Withdraw
*/
const withdraw = asyncHandler(
    async (req, res) => {

        await withdrawApplication(
            req.user.id,
            req.params.id
        );


        res.status(200).json({
            success: true,
            message: "Application withdrawn successfully",
        });
    }
);


/*
    Recruiter → Job applications
*/
const getForJob = asyncHandler(
    async (req, res) => {

        const applications =
            await getJobApplications(
                req.user.id,
                req.params.jobId
            );


        res.status(200).json({
            success: true,
            data: {
                applications,
            },
        });
    }
);


/*
    Recruiter → Update status
*/
const updateStatus = asyncHandler(
    async (req, res) => {

        const { error, value } =
            updateApplicationStatusSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );


        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }


        const application =
            await updateApplicationStatus(
                req.user.id,
                req.params.id,
                value.status
            );


        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: {
                application,
            },
        });
    }
);


export {
    apply, getForJob, getMine,
    getOne, updateStatus, withdraw
};
