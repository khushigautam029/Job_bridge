import express from "express";
import {
    addSkill,
    getSkills,
    removeSkill,
} from "../controllers/candidateSkillController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get( "/", protect, authorize("CANDIDATE"), getSkills);
router.post( "/", protect, authorize("CANDIDATE"), addSkill);
router.delete( "/:skillId", protect, authorize("CANDIDATE"), removeSkill);

export default router;