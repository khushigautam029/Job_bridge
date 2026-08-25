import express from "express";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
    getCompanies,
    getCompany,
    getMyCompanyController,
    updateMyCompanyController,
} from "../controllers/companyController.js";
import {
    updateCompanySchema,
} from "../validation/companyValidation.js";
const router = express.Router();

// Recruiter APIs
router.get( "/my", protect, authorize("RECRUITER"), getMyCompanyController);
router.put( "/my", protect, authorize("RECRUITER"), validate(updateCompanySchema), updateMyCompanyController);
router.get( "/",getCompanies);
router.get("/:id",getCompany);

export default router;