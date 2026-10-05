import express from "express";
import {
    create,
    getAll,
    getCategories,
    getMine,
    getOne,
    remove,
    update,
} from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
const router = express.Router();

// Public
router.get("/categories", getCategories);
router.get("/",  getAll);
router.get("/my", protect, authorize("RECRUITER"), getMine);
router.get( "/:id", getOne);

// Recruiter only
router.post( "/", protect, authorize("RECRUITER"), create);
router.put( "/:id", protect, authorize("RECRUITER"), update);
router.delete( "/:id", protect, authorize("RECRUITER"), remove);

export default router;