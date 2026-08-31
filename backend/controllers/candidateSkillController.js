import {
    addCandidateSkill,
    getCandidateSkills,
    removeCandidateSkill,
} from "../services/candidateSkillService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    addCandidateSkillSchema,
} from "../validation/candidateSkillValidation.js";

const getSkills = asyncHandler(
    async (req, res) => {
        const skills =
            await getCandidateSkills(
                req.user.id
            );
        res.status(STATUS_CODES,OK).json({
            success: true,
            data: {
                skills,
            },
        });
    }
);


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
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }
        const skill =
            await addCandidateSkill(
                req.user.id,
                value.skillId
            );
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.SKILL_ADDED,
            data: {
                skill,
            },
        });
    }
);


const removeSkill = asyncHandler(
    async (req, res) => {
        await removeCandidateSkill(
            req.user.id,
            req.params.skillId
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.SKILL_REMOVED,
        });
    }
);

export {
    addSkill, getSkills, removeSkill
};
