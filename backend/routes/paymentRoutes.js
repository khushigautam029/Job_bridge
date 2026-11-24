import express from "express";
import { getPaymentPlans } from "../controllers/paymentController.js";

const router = express.Router();
router.get("/plans",getPaymentPlans);

export default router;