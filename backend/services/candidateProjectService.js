import {
    CandidateProfile,
    CandidateProject,
} from "../models/index.js";
import {
    STATUS_CODES,
} from "../utils/setConstants.js";


const findCandidateProfile = async (userId) => {
    const candidateProfile =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return candidateProfile;
};


const getCandidateProjects = async (userId) => {
    const candidateProfile =
        await findCandidateProfile(userId);

    const projects =
        await CandidateProject.findAll({
            where: {
                candidateId:
                    candidateProfile.id,
            },

            order: [
                ["currentlyWorking", "DESC"],
                ["startDate", "DESC"],
                ["id", "DESC"],
            ],
        });

    return projects;
};


const getCandidateProjectById = async (
    userId,
    projectId
) => {
    const candidateProfile =
        await findCandidateProfile(userId);

    const project =
        await CandidateProject.findOne({
            where: {
                id: projectId,
                candidateId:
                    candidateProfile.id,
            },
        });

    if (!project) {
        const error = new Error(
            "Project not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return project;
};


const addCandidateProject = async (
    userId,
    data
) => {
    const candidateProfile =
        await findCandidateProfile(userId);

    const project =
        await CandidateProject.create({
            candidateId:
                candidateProfile.id,

            title: data.title,

            description:
                data.description || null,

            technologies:
                data.technologies || null,

            projectUrl:
                data.projectUrl || null,

            githubUrl:
                data.githubUrl || null,

            startDate:
                data.startDate || null,

            endDate:
                data.endDate || null,

            currentlyWorking:
                data.currentlyWorking ?? false,

            role:
                data.role || null,
        });

    return project;
};


const updateCandidateProject = async (
    userId,
    projectId,
    data
) => {
    const project =
        await getCandidateProjectById(
            userId,
            projectId
        );

    await project.update(data);

    return project;
};


const deleteCandidateProject = async (
    userId,
    projectId
) => {
    const project =
        await getCandidateProjectById(
            userId,
            projectId
        );

    await project.destroy();

    return {
        projectId: Number(projectId),

        message:
            "Project deleted successfully",
    };
};


export {
    addCandidateProject, deleteCandidateProject, getCandidateProjectById, getCandidateProjects, updateCandidateProject
};

