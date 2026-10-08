import express from "express";
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    updateProject,
} from "../controllers/candidateProjectController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import validate from "../middleware/validateMiddleware.js";

import {
    createCandidateProjectSchema,
    updateCandidateProjectSchema,
} from "../validation/candidateProjectValidation.js";


const router = express.Router();


router.use(
    protect,
    authorizeRoles("CANDIDATE")
);


router.get(
    "/",
    getProjects
);


router.get(
    "/:projectId",
    getProject
);


router.post(
    "/",
    validate(
        createCandidateProjectSchema
    ),
    createProject
);


router.put(
    "/:projectId",
    validate(
        updateCandidateProjectSchema
    ),
    updateProject
);


router.delete(
    "/:projectId",
    deleteProject
);


export default router;
