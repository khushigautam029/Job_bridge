import express from "express";
import {
    apply,
    getAtsScore,
    getForJob,
    getForRecruiter,
    getMine,
    getOne,
    runJobAtsAnalysis,
    updateStatus,
    withdraw
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post( "/jobs/:jobId/apply", protect, apply);
router.get( "/applications/my-applications", protect, getMine);
router.get("/applications/recruiter", protect, getForRecruiter);
router.delete( "/applications/:id", protect, withdraw);
router.get( "/applications/:id", protect, getOne);
router.get( "/jobs/:jobId/applications", protect, getForJob);
router.patch( "/applications/:id/status", protect, updateStatus);
router.get("/applications/:id/ats-score", protect, getAtsScore);
router.post("/jobs/:jobId/ats-analysis", protect,runJobAtsAnalysis);

export default router;