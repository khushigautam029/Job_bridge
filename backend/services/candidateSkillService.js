import {
    CandidateProfile,
    CandidateSkill,
    Skill,
} from "../models/index.js";


const getCandidateSkills = async (userId) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidate) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode = 404;

        throw error;
    }

    const skills = await Skill.findAll({
        include: [
            {
                model: CandidateProfile,
                as: "candidates",
                where: {
                    id: candidate.id,
                },
                attributes: [],
                through: {
                    attributes: [],
                },
            },
        ],
        order: [
            ["name", "ASC"],
        ],
    });

    return skills;
};


const addCandidateSkill = async (
    userId,
    skillId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidate) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode = 404;

        throw error;
    }

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

    const existingSkill =
        await CandidateSkill.findOne({
            where: {
                candidateId: candidate.id,
                skillId,
            },
        });

    if (existingSkill) {
        const error = new Error(
            "Skill already added"
        );

        error.statusCode = 409;

        throw error;
    }

    await CandidateSkill.create({
        candidateId: candidate.id,
        skillId,
    });

    return skill;
};


const removeCandidateSkill = async (
    userId,
    skillId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidate) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode = 404;

        throw error;
    }

    const candidateSkill =
        await CandidateSkill.findOne({
            where: {
                candidateId: candidate.id,
                skillId,
            },
        });

    if (!candidateSkill) {
        const error = new Error(
            "Skill is not added to your profile"
        );

        error.statusCode = 404;

        throw error;
    }

    await candidateSkill.destroy();
};


export {
    addCandidateSkill, getCandidateSkills, removeCandidateSkill
};
