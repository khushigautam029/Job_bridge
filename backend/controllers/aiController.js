
import { Op } from "sequelize";
import { AiConversation, AiMessage } from "../models/index.js";
import generateAIResponse from "../utils/geminiService.js";
import { STATUS_CODES } from "../utils/setConstants.js";

const ALLOWED_ROLES = ["CANDIDATE", "RECRUITER"];
const MESSAGE_LIMIT = 2000;
const HISTORY_LIMIT = 10;
const MESSAGE_RETENTION_DAYS = 30;

// Get the user's single AI conversation
const getAIConversation = async (req, res, next) => {
    try {
        const role = req.user.role;

        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to use the AI assistant.",
            });
        }

        const [conversation] = await AiConversation.findOrCreate({
            where: {
                userId: req.user.id,
            },
            defaults: {
                userId: req.user.id,
            },
        });

        const expirationDate = new Date(
            Date.now() - MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000
        );

        const messages = await AiMessage.findAll({
            where: {
                conversationId: conversation.id,
                createdAt: {
                    [Op.gte]: expirationDate,
                },
            },
            attributes: ["id", "sender", "message", "createdAt"],
            order: [["createdAt", "ASC"]],
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "AI conversation fetched successfully.",
            data: {
                conversationId: conversation.id,
                messages,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Send a message to AI and save the conversation
const chatWithAI = async (req, res, next) => {
    try {
        const { message } = req.body;

        // Validate message
        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Please enter a valid message.",
            });
        }

        const trimmedMessage = message.trim();

        if (trimmedMessage.length > MESSAGE_LIMIT) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Message cannot exceed 2000 characters.",
            });
        }

        const role = req.user.role;

        // Allow only candidates and recruiters
        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to use the AI assistant.",
            });
        }

        // Find or create one conversation for this user
        const [conversation] = await AiConversation.findOrCreate({
            where: {
                userId: req.user.id,
            },
            defaults: {
                userId: req.user.id,
            },
        });

        const expirationDate = new Date(
            Date.now() - MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000
        );

        // Fetch recent conversation history from database
        const previousMessages = await AiMessage.findAll({
            where: {
                conversationId: conversation.id,
                createdAt: {
                    [Op.gte]: expirationDate,
                },
            },
            attributes: ["sender", "message"],
            order: [["createdAt", "DESC"]],
            limit: HISTORY_LIMIT,
        });

        // Restore chronological order
        const history = previousMessages
            .reverse()
            .map((item) => ({
                role: item.sender === "USER" ? "user" : "model",
                text: item.message,
            }));

        // Gemini conversation history should begin with a user message
        while (history.length > 0 && history[0].role === "model") {
            history.shift();
        }

        // Save the user's message
        const userMessage = await AiMessage.create({
            conversationId: conversation.id,
            sender: "USER",
            message: trimmedMessage,
        });

        // Generate AI response using stored history
        const reply = await generateAIResponse({
            message: trimmedMessage,
            history,
            role,
        });

        if (!reply || !reply.trim()) {
            throw new Error("AI could not generate a response. Please try again.");
        }

        // Save Gemini's response
        const aiMessage = await AiMessage.create({
            conversationId: conversation.id,
            sender: "AI",
            message: reply.trim(),
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "AI response generated successfully.",
            data: {
                conversationId: conversation.id,
                userMessage,
                aiMessage,
                reply: aiMessage.message,
            },
        });
    } catch (error) {
        next(error);
    }
};

export { chatWithAI, getAIConversation };
