import express from "express";
import {
    addSkill,
    getSkills,
    removeSkill,
} from "../controllers/jobSkillController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.get( "/jobs/:jobId/skills", protect, getSkills);
router.post( "/jobs/:jobId/skills", protect, addSkill);
router.delete( "/jobs/:jobId/skills/:skillId", protect, removeSkill);

export default router;