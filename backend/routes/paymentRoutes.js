import express from "express";
import { createCheckoutSession, getMyPlan, getPaymentPlans, verifyCheckoutSession } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/plans",getPaymentPlans);
router.post(
    "/checkout-session",
    authMiddleware,
    createCheckoutSession
);
router.get(
    "/my-plan",
    authMiddleware,
    getMyPlan
);
router.get(
    "/verify-session",
    authMiddleware,
    verifyCheckoutSession
);

export default router;