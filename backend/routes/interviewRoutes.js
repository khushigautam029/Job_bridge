import express from "express";

import {
    cancel,
    getMine,
    getRecruiterMine,
    getOne,
    schedule,
    update,
    updateStatus,
} from "../controllers/interviewController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

// Recruiter → Schedule interview
router.post( "/applications/:applicationId/interviews", protect, schedule);
// Candidate → My interviews
router.get( "/interviews/my-interviews", protect, getMine);
router.get("/interviews/recruiter", protect, getRecruiterMine);
// Candidate / Recruiter → Get one
router.get( "/interviews/:id", protect, getOne);
// Recruiter → Update interview
router.patch( "/interviews/:id", protect, update);
// Recruiter → Update status
router.patch( "/interviews/:id/status", protect, updateStatus);
// Recruiter → Cancel
router.delete( "/interviews/:id", protect, cancel);

export default router;