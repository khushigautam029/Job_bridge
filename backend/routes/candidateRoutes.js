import express from "express";
import {
    getProfile,
    updateProfile,
} from "../controllers/candidateController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get( "/profile", protect,authorize("CANDIDATE"),getProfile);
router.put( "/profile", protect, authorize("CANDIDATE"), updateProfile );

export default router;