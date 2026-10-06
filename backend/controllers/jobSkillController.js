import {
    addJobSkill,
    getJobSkills,
    removeJobSkill,
} from "../services/jobSkillService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendError,
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";
import {
    addJobSkillSchema,
} from "../validation/jobSkillValidation.js";

// GET JOB SKILLS
const getSkills = asyncHandler(
    async (req, res) => {
        const { jobId } = req.params;

        const skills =
            await getJobSkills(jobId);

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.JOB_SKILLS_FETCHED,
            {
                skills,
            }
        );
    }
);

// ADD SKILL TO JOB
const addSkill = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = addJobSkillSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );

        if (error) {
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.VALIDATION_FAILED,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const { jobId } = req.params;

        const jobSkill =
            await addJobSkill(
                req.user.id,
                jobId,
                value.skillId
            );

        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.SKILL_ADDED_TO_JOB,
            {
                jobSkill,
            }
        );
    }
);

// REMOVE SKILL FROM JOB
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
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.SKILL_REMOVED_FROM_JOB
        );
    }
);

export {
    addSkill,
    getSkills,
    removeSkill
};
