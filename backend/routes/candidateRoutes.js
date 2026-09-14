import express from "express";
import {
    getCandidateResume,
    getProfile,
    getProfileCompletion,
    updateProfile,
    uploadResume,
} from "../controllers/candidateController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import uploadResumeMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Candidate profile
router.get(
    "/profile",
    protect,
    authorizeRoles("CANDIDATE"),
    getProfile
);
router.put(
    "/profile",
    protect,
    authorizeRoles("CANDIDATE"),
    updateProfile
);
// Candidate uploads resume
router.post(
    "/profile/resume",
    protect,
    authorizeRoles("CANDIDATE"),
    uploadResumeMiddleware,
    uploadResume
);
// Candidate profile completion
router.get(
    "/profile/completion",
    protect,
    authorizeRoles("CANDIDATE"),
    getProfileCompletion
);
/*
    Recruiter views candidate resume
    Recruiter must have at least one job
    to which this candidate has applied.
*/
router.get(
    "/:candidateId/resume",
    protect,
    authorizeRoles("RECRUITER"),
    getCandidateResume
);

export default router;