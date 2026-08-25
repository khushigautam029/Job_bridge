import asyncHandler from "../utils/asyncHandler.js";

import {
    getAllSkills,
    getSkillById,
} from "../services/skillService.js";


const getSkills = asyncHandler(
    async (req, res) => {

        const skills =
            await getAllSkills();

        res.status(200).json({
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

        res.status(200).json({
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
