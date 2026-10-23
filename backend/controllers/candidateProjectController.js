import {
    addCandidateProject,
    deleteCandidateProject,
    getCandidateProjectById,
    getCandidateProjects,
    updateCandidateProject,
} from "../services/candidateProjectService.js";
import {
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

const getProjects = async (req, res) => {
    const projects =
        await getCandidateProjects(
            req.user.id
        );
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.PROJECTS_FETCHED,
        {
            projects,
        }
    );
};

const getProject = async (req, res) => {
    const project =
        await getCandidateProjectById(
            req.user.id,
            req.params.projectId
        );
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.PROJECT_FETCHED,
        {
            project,
        }
    );
};

const createProject = async (req, res) => {
    const project =
        await addCandidateProject(
            req.user.id,
            req.body
        );
    return sendSuccess(
        res,
        STATUS_CODES.CREATED,
        MESSAGES.PROJECT_ADDED,
        {
            project,
        }
    );
};

const updateProject = async (req, res) => {
    const project =
        await updateCandidateProject(
            req.user.id,
            req.params.projectId,
            req.body
        );
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.PROJECT_UPDATED,
        {
            project,
        }
    );
};


const deleteProject = async (req, res) => {
    const result =
        await deleteCandidateProject(
            req.user.id,
            req.params.projectId
        );
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        result.message,
        {
            projectId:
                result.projectId,
        }
    );
};


export {
    createProject, deleteProject, getProject, getProjects, updateProject
};

