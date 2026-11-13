
import generateAIResponse from "../utils/geminiService.js";
import { STATUS_CODES } from "../utils/setConstants.js";

const chatWithAI = async (req, res, next) => {
    try {
        const { message, history = [] } = req.body;

        // Validate message
        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Please enter a valid message.",
            });
        }

        // Validate message length
        if (message.length > 2000) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Message cannot exceed 2000 characters.",
            });
        }

        // Validate conversation history
        if (!Array.isArray(history) || history.length > 10) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Invalid conversation history.",
            });
        }

        const validHistory = history.every(
            (item) =>
                item &&
                ["user", "model"].includes(item.role) &&
                typeof item.text === "string" &&
                item.text.length <= 2000
        );

        if (!validHistory) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Invalid conversation history format.",
            });
        }

        const role = req.user.role;

        // Allow only candidates and recruiters
        if (!["CANDIDATE", "RECRUITER"].includes(role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to use the AI assistant.",
            });
        }

        const reply = await generateAIResponse({
            message: message.trim(),
            history,
            role,
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "AI response generated successfully.",
            data: {
                reply,
            },
        });

    } catch (error) {
        next(error);
    }
};

export default chatWithAI;
