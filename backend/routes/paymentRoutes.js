import express from "express";
import { createCheckoutSession, getPaymentPlans } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/plans",getPaymentPlans);
router.post(
    "/checkout-session",
    authMiddleware,
    createCheckoutSession
);

export default router;