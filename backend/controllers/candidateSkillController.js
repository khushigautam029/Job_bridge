import {
    addCandidateSkill,
    getCandidateSkills,
    removeCandidateSkill,
} from "../services/candidateSkillService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    STATUS_CODES,
} from "../utils/setConstants.js";
import {
    addCandidateSkillSchema,
} from "../validation/candidateSkillValidation.js";

// GET CANDIDATE SKILLS
const getSkills = asyncHandler(
    async (req, res) => {

        const skills =
            await getCandidateSkills(
                req.user.id
            );


        res.status(
            STATUS_CODES.OK
        ).json({
            success: true,

            data: {
                skills,
            },
        });
    }
);


// ADD CANDIDATE SKILL
const addSkill = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } =
            addCandidateSkillSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );


        if (error) {
            return res.status(
                STATUS_CODES.BAD_REQUEST
            ).json({
                success: false,

                message:
                    "Validation failed",

                errors:
                    error.details.map(
                        (detail) =>
                            detail.message
                    ),
            });
        }


        const skill =
            await addCandidateSkill(
                req.user.id,
                value.skillId
            );


        res.status(
            STATUS_CODES.CREATED
        ).json({
            success: true,

            message:
                "Skill added successfully",

            data: {
                skill,
            },
        });
    }
);



// REMOVE CANDIDATE SKILL
const removeSkill = asyncHandler(
    async (req, res) => {

        const {
            skillId,
        } = req.params;


        const result =
            await removeCandidateSkill(
                req.user.id,
                Number(skillId)
            );


        res.status(
            STATUS_CODES.OK
        ).json({
            success: true,

            message:
                result.message,

            data: {
                skillId:
                    result.skillId,
            },
        });
    }
);


export {
    addSkill, getSkills, removeSkill
};

