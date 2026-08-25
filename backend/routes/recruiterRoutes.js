import express from "express";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
    getProfile,
    updateProfile,
} from "../controllers/recruiterController.js";

const router = express.Router();


router.get(
    "/profile",
    protect,
    authorize("RECRUITER"),
    getProfile
);


router.put(
    "/profile",
    protect,
    authorize("RECRUITER"),
    updateProfile
);


export default router;