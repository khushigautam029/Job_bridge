import express from "express";
import {
    createExperience,
    deleteExperience,
    getExperience,
    getExperiences,
    updateExperience,
} from "../controllers/candidateExperienceController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
    createCandidateExperienceSchema,
    updateCandidateExperienceSchema,
} from "../validation/candidateExperienceValidation.js";


const router = express.Router();

router.use(
    protect,
    authorizeRoles("CANDIDATE")
);

router.get(
    "/",
    getExperiences
);

router.get(
    "/:experienceId",
    getExperience
);

router.post(
    "/",
    validate(createCandidateExperienceSchema),
    createExperience
);

router.put(
    "/:experienceId",
    validate(updateCandidateExperienceSchema),
    updateExperience
);

router.delete(
    "/:experienceId",
    deleteExperience
);

export default router;
