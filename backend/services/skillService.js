import { Skill } from "../models/index.js";


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

        error.statusCode = 404;

        throw error;
    }

    return skill;
};


export {
    getAllSkills,
    getSkillById
};
