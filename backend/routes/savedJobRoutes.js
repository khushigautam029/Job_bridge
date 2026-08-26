import express from "express";

import {
    checkSaved,
    getMine,
    remove,
    save,
} from "../controllers/savedJobController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post( "/jobs/:jobId/save", protect, save);
router.get( "/saved-jobs", protect, getMine);
router.get( "/jobs/:jobId/is-saved", protect, checkSaved);
router.delete( "/jobs/:jobId/save", protect, remove);

export default router;