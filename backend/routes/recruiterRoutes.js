import express from "express";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
    getMyProfile,
    updateMyProfile,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.get(
    "/profile",
    protect,
    authorize("RECRUITER"),
    getMyProfile
);

router.put(
    "/profile",
    protect,
    authorize("RECRUITER"),
    updateMyProfile
);

export default router;