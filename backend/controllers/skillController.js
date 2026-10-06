import {
    getAllSkills,
    getSkillById,
} from "../services/skillService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

// GET ALL SKILLS
const getSkills = asyncHandler(
    async (req, res) => {
        const skills =
            await getAllSkills();
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.SKILLS_FETCHED,
            {
                skills,
            }
        );
    }
);

// GET SKILL BY ID
const getSkill = asyncHandler(
    async (req, res) => {
        const skill =
            await getSkillById(
                req.params.id
            );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.SKILL_FETCHED,
            {
                skill,
            }
        );
    }
);

export {
    getSkill,
    getSkills
};

