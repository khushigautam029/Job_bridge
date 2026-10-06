import {
    addCandidateSkill,
    getCandidateSkills,
    removeCandidateSkill,
} from "../services/candidateSkillService.js";
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
    addCandidateSkillSchema,
} from "../validation/candidateSkillValidation.js";

// Get Candidate Skills
const getSkills = asyncHandler(
    async (req, res) => {
        const skills =
            await getCandidateSkills(
                req.user.id
            );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            "Candidate skills retrieved successfully",
            {
                skills,
            }
        );
    }
);

// Add Candidate Skill
const addSkill = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = addCandidateSkillSchema.validate(
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

        const skill =
            await addCandidateSkill(
                req.user.id,
                value.skillId
            );

        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.SKILL_ADDED,
            {
                skill,
            }
        );
    }
);

// Remove Candidate Skill
const removeSkill = asyncHandler(
    async (req, res) => {
        await removeCandidateSkill(
            req.user.id,
            req.params.skillId
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.SKILL_REMOVED
        );
    }
);

export {
    addSkill,
    getSkills,
    removeSkill
};
