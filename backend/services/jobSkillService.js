import {
    Job,
    JobSkill,
    RecruiterProfile,
    Skill,
} from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";


const getJobSkills = async (jobId) => {

    const job = await Job.findByPk(jobId);

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const skills = await Skill.findAll({
        include: [
            {
                model: Job,
                as: "jobs",
                where: {
                    id: jobId,
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


const addJobSkill = async (
    userId,
    jobId,
    skillId
) => {

    const job = await Job.findByPk(jobId);

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    const recruiterProfile =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiterProfile) {
        const error = new Error(
            "Recruiter profile not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    if (
        job.recruiterId !== recruiterProfile.id
    ) {
        const error = new Error(
            "You are not authorized to modify this job"
        );

        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }


    const skill = await Skill.findByPk(skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    const existingJobSkill =
        await JobSkill.findOne({
            where: {
                jobId,
                skillId,
            },
        });

    if (existingJobSkill) {
        const error = new Error(
            "Skill is already added to this job"
        );

        error.statusCode = STATUS_CODES.CONFLICT;
        throw error;
    }


    const jobSkill = await JobSkill.create({
        jobId,
        skillId,
    });


    return {
        id: jobSkill.id,
        jobId: jobSkill.jobId,
        skillId: jobSkill.skillId,
        skill: {
            id: skill.id,
            name: skill.name,
        },
    };
};


const removeJobSkill = async (
    userId,
    jobId,
    skillId
) => {

    const job = await Job.findByPk(jobId);

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    const recruiterProfile =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiterProfile) {
        const error = new Error(
            "Recruiter profile not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    if (
        job.recruiterId !== recruiterProfile.id
    ) {
        const error = new Error(
            "You are not authorized to modify this job"
        );

        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }


    const jobSkill =
        await JobSkill.findOne({
            where: {
                jobId,
                skillId,
            },
        });

    if (!jobSkill) {
        const error = new Error(
            "Skill is not associated with this job"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    await jobSkill.destroy();

    return true;
};


export {
    addJobSkill, getJobSkills, removeJobSkill
};
