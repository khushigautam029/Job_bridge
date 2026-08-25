import { Skill } from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";


const getAllSkills = async () => {

    const skills = await Skill.findAll({
        order: [
            ["name", "ASC"],
        ],
    });

    return skills;
};


const getSkillById = async (skillId) => {

    const skill = await Skill.findByPk(
        skillId
    );

    if (!skill) {
        const error = new Error(
            "Skill not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return skill;
};


export {
    getAllSkills,
    getSkillById
};
