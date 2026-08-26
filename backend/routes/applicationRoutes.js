import express from "express";
import {
    apply,
    getForJob,
    getMine,
    getOne,
    updateStatus,
    withdraw,
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post( "/jobs/:jobId/apply", protect, apply);
router.get( "/applications/my-applications", protect, getMine);
router.delete( "/applications/:id", protect, withdraw);
router.get( "/applications/:id", protect, getOne);
router.get( "/jobs/:jobId/applications", protect, getForJob);
router.patch( "/applications/:id/status", protect, updateStatus);

export default router;