import express from "express";
import {
    addEducation,
    deleteEducation,
    getEducation,
    getEducations,
    updateEducation,
} from "../controllers/candidateEducationController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET ALL EDUCATION
router.get(
    "/",
    protect,
    authorizeRoles("CANDIDATE"),
    getEducations
);

// GET EDUCATION BY ID
router.get(
    "/:educationId",
    protect,
    authorizeRoles("CANDIDATE"),
    getEducation
);

// ADD EDUCATION
router.post(
    "/",
    protect,
    authorizeRoles("CANDIDATE"),
    addEducation
);

// UPDATE EDUCATION
router.put(
    "/:educationId",
    protect,
    authorizeRoles("CANDIDATE"),
    updateEducation
);

// DELETE EDUCATION
router.delete(
    "/:educationId",
    protect,
    authorizeRoles("CANDIDATE"),
    deleteEducation
);


export default router;
