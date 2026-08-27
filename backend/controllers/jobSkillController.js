import asyncHandler from "../utils/asyncHandler.js";

import {
    addJobSkill,
    getJobSkills,
    removeJobSkill,
} from "../services/jobSkillService.js";

import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    addJobSkillSchema,
} from "../validation/jobSkillValidation.js";


const getSkills = asyncHandler(
    async (req, res) => {

        const { jobId } = req.params;

        const skills =
            await getJobSkills(jobId);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                skills,
            },
        });
    }
);


const addSkill = asyncHandler(
    async (req, res) => {

        const { error, value } =
            addJobSkillSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }


        const { jobId } = req.params;

        const jobSkill =
            await addJobSkill(
                req.user.id,
                jobId,
                value.skillId
            );


        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.SKILL_ADDED_TO_JOB,
            data: {
                jobSkill,
            },
        });
    }
);


const removeSkill = asyncHandler(
    async (req, res) => {

        const {
            jobId,
            skillId,
        } = req.params;


        await removeJobSkill(
            req.user.id,
            jobId,
            skillId
        );


        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.SKILL_REMOVED_FROM_JOB,
        });
    }
);


export {
    addSkill, getSkills, removeSkill
};
