import express from "express";
import {
    getCandidateDashboardController,
    getRecruiterDashboardController,
} from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get( "/candidate", protect, authorizeRoles("CANDIDATE"), getCandidateDashboardController);
router.get( "/recruiter", protect, authorizeRoles("RECRUITER"), getRecruiterDashboardController);

export default router;