
import express from "express";
import {
    chatWithAI,
    chatWithPublicAI,
    getAIConversation,
} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";
import { publicAiLimiter } from "../utils/rateLimiter.js";

const router = express.Router();

router.post("/public-chat", publicAiLimiter, chatWithPublicAI);
router.get("/conversation", protect, getAIConversation);

router.post("/chat", protect, chatWithAI);

export default router;