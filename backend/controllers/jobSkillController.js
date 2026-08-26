import asyncHandler from "../utils/asyncHandler.js";

import {
    addJobSkill,
    getJobSkills,
    removeJobSkill,
} from "../services/jobSkillService.js";

import {
    addJobSkillSchema,
} from "../validation/jobSkillValidation.js";


const getSkills = asyncHandler(
    async (req, res) => {

        const { jobId } = req.params;

        const skills =
            await getJobSkills(jobId);

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

        const { error, value } =
            addJobSkillSchema.validate(
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


        const { jobId } = req.params;

        const jobSkill =
            await addJobSkill(
                req.user.id,
                jobId,
                value.skillId
            );


        res.status(201).json({
            success: true,
            message: "Skill added to job successfully",
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


        res.status(200).json({
            success: true,
            message: "Skill removed from job successfully",
        });
    }
);


export {
    addSkill, getSkills, removeSkill
};
