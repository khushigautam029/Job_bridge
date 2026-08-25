import asyncHandler from "../utils/asyncHandler.js";

import {
    addCandidateSkill,
    getCandidateSkills,
    removeCandidateSkill,
} from "../services/candidateSkillService.js";

import {
    addCandidateSkillSchema,
} from "../validation/candidateSkillValidation.js";


const getSkills = asyncHandler(
    async (req, res) => {

        const skills =
            await getCandidateSkills(
                req.user.id
            );

        res.status(200).json({
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
            return res.status(400).json({
                success: false,
                message: "Validation failed",
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

        res.status(201).json({
            success: true,
            message: "Skill added successfully",
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

        res.status(200).json({
            success: true,
            message: "Skill removed successfully",
        });
    }
);


export {
    addSkill, getSkills, removeSkill
};
