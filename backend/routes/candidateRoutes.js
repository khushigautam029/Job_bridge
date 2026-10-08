import express from "express";
import {
    deleteProfileImage,
    deleteResume,
    getCandidateResume,
    getProfile,
    getProfileCompletion,
    updateProfile,
    uploadProfileImage,
    uploadResume,
} from "../controllers/candidateController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import uploadResumeMiddleware from "../middleware/uploadMiddleware.js";
import uploadProfileImageMiddleware from "../middleware/uploadProfileImage.js";

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

router.delete(
    "/profile/resume",
    protect,
    authorizeRoles("CANDIDATE"),
    deleteResume
);

router.post(
    "/profile/image",
    protect,
    authorizeRoles("CANDIDATE"),
    uploadProfileImageMiddleware,
    uploadProfileImage
);

router.delete(
    "/profile/image",
    protect,
    authorizeRoles("CANDIDATE"),
    deleteProfileImage
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