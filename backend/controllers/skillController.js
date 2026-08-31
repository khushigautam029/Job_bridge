import {
    getAllSkills,
    getSkillById,
} from "../services/skillService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { STATUS_CODES } from "../utils/setConstants.js";

const getSkills = asyncHandler(
    async (req, res) => {
        const skills =
            await getAllSkills();
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                skills,
            },
        });
    }
);

const getSkill = asyncHandler(
    async (req, res) => {
        const skill =
            await getSkillById(
                req.params.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                skill,
            },
        });
    }
);

export {
    getSkill, getSkills
};
