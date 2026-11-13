
import { Op } from "sequelize";
import {
    AiConversation,
    AiMessage,
    Application,
    CandidateProfile,
    Company,
    Interview,
    Job,
    RecruiterProfile,
    User,
} from "../models/index.js";

import generateAIResponse from "../utils/geminiService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

const ALLOWED_ROLES = ["CANDIDATE", "RECRUITER"];
const MESSAGE_LIMIT = 2000;
const HISTORY_LIMIT = 10;
const MESSAGE_RETENTION_DAYS = 30;

const isPersonalInterviewQuery = (message) => {
    const patterns = [
        /\b(my|mine)\s+(upcoming\s+|scheduled\s+)?interviews?\b/i,
        /\b(show|list|view|check|see|get|find)\b.{0,60}\binterviews?\b/i,
        /\binterview\s+(schedule|details|dates|times|status)\b/i,
        /\bwhen\b.{0,50}\binterviews?\b/i,
        /\bupcoming\s+interviews?\b/i,
        /\bscheduled\s+interviews?\b/i,
        /\bwhen\s+is\s+my\s+interview\b/i,
    ];

    return patterns.some((pattern) => pattern.test(message));
};

const formatInterview = (interview, jobTitle, companyName, candidateName = null) => {
    const date = new Date(interview.scheduledAt);

    return [
        `Job: ${jobTitle || "Not available"}`,
        `Company: ${companyName || "Not available"}`,
        ...(candidateName ? [`Candidate: ${candidateName}`] : []),
        `Date and time (UTC): ${date.toISOString()}`,
        `Interview type: ${interview.interviewType}`,
        `Status: ${interview.status}`,
        `Meeting link: ${interview.meetingLink || "Not provided"}`,
        `Location: ${interview.location || "Not provided"}`,
        `Notes: ${interview.notes || "No additional notes"}`,
    ].join("\n");
};

// Fetch interviews belonging to the logged-in candidate
const getCandidateInterviews = async (userId) => {
    const candidateProfile = await CandidateProfile.findOne({
        where: { userId },
        attributes: ["id"],
    });

    if (!candidateProfile) {
        return [];
    }

    const applications = await Application.findAll({
        where: {
            candidateId: candidateProfile.id,
        },
        attributes: ["id"],
        include: [
            {
                model: Interview,
                as: "interviews",
                required: true,
                attributes: [
                    "id",
                    "scheduledAt",
                    "interviewType",
                    "meetingLink",
                    "location",
                    "notes",
                    "status",
                ],
            },
            {
                model: Job,
                as: "job",
                attributes: ["id", "title"],
                include: [
                    {
                        model: Company,
                        as: "company",
                        attributes: ["name"],
                    },
                ],
            },
        ],
    });

    return applications.flatMap((application) =>
        application.interviews.map((interview) => ({
            interview,
            jobTitle: application.job?.title,
            companyName: application.job?.company?.name,
        }))
    );
};

// Fetch interviews belonging to jobs posted by the logged-in recruiter
const getRecruiterInterviews = async (userId) => {
    const recruiterProfile = await RecruiterProfile.findOne({
        where: { userId },
        attributes: ["id"],
    });

    if (!recruiterProfile) {
        return [];
    }

    const jobs = await Job.findAll({
        where: {
            recruiterId: recruiterProfile.id,
        },
        attributes: ["id", "title"],
        include: [
            {
                model: Company,
                as: "company",
                attributes: ["name"],
            },
            {
                model: Application,
                as: "applications",
                required: true,
                attributes: ["id"],
                include: [
                    {
                        model: Interview,
                        as: "interviews",
                        required: true,
                        attributes: [
                            "id",
                            "scheduledAt",
                            "interviewType",
                            "meetingLink",
                            "location",
                            "notes",
                            "status",
                        ],
                    },
                    {
                        model: CandidateProfile,
                        as: "candidate",
                        attributes: ["id"],
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: ["name", "email"],
                            },
                        ],
                    },
                ],
            },
        ],
    });

    return jobs.flatMap((job) =>
        job.applications.flatMap((application) =>
            application.interviews.map((interview) => ({
                interview,
                jobTitle: job.title,
                companyName: job.company?.name,
                candidateName: application.candidate?.user?.name,
                candidateEmail: application.candidate?.user?.email,
            }))
        )
    );
};

// Create a readable response using actual database records
const createInterviewResponse = (interviews, role) => {
    if (!interviews.length) {
        return role === "CANDIDATE"
            ? "You don't have any interviews scheduled on JobBridge yet. Once a recruiter schedules an interview for one of your applications, its details will appear here."
            : "There are no interviews scheduled for applications received on your jobs yet.";
    }

    const heading =
        role === "CANDIDATE"
            ? "Here are your interview details:"
            : "Here are the interviews scheduled for applications to your jobs:";

    const details = interviews.map((item, index) => {
        const candidateInfo =
            role === "RECRUITER"
                ? `\nCandidate email: ${item.candidateEmail || "Not available"}`
                : "";

        return `\nInterview ${index + 1}\n${formatInterview(
            item.interview,
            item.jobTitle,
            item.companyName,
            item.candidateName
        )}${candidateInfo}`;
    });

    return `${heading}\n${details.join("\n\n")}`;
};

// Get the user's single AI conversation
const getAIConversation = async (req, res, next) => {
    try {
        const role = req.user.role;

        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: MESSAGES.YOU_ARE_NOT_ALLOWED_TO_USE_AI_ASSISTANT,
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
            message: MESSAGES.AI_CONVERSATION_FETCHED,
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

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.PLEASE_ENTER_A_VALID_MESSAGE,
            });
        }

        const trimmedMessage = message.trim();

        if (trimmedMessage.length > MESSAGE_LIMIT) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.MESSAGE_CANNOT_EXCEED_2000_CHARACTERS,
            });
        }

        const role = req.user.role;

        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: MESSAGES.YOU_ARE_NOT_ALLOWED_TO_USE_AI_ASSISTANT,
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

        const history = previousMessages
            .reverse()
            .map((item) => ({
                role: item.sender === "USER" ? "user" : "model",
                text: item.message,
            }));

        while (history.length > 0 && history[0].role === "model") {
            history.shift();
        }

        const userMessage = await AiMessage.create({
            conversationId: conversation.id,
            sender: "USER",
            message: trimmedMessage,
        });

        let reply;

        // Personal interview questions are answered using database records.
        // Other questions continue to use Gemini.
        if (isPersonalInterviewQuery(trimmedMessage)) {
            const interviews =
                role === "CANDIDATE"
                    ? await getCandidateInterviews(req.user.id)
                    : await getRecruiterInterviews(req.user.id);

            reply = createInterviewResponse(interviews, role);
        } else {
            reply = await generateAIResponse({
                message: trimmedMessage,
                history,
                role,
            });
        }

        if (!reply || !reply.trim()) {
            throw new Error(
                "AI could not generate a response. Please try again."
            );
        }

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

// Public chatbot endpoint; it does not read or persist user-specific data.
const chatWithPublicAI = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.PLEASE_ENTER_A_VALID_MESSAGE,
            });
        }

        const trimmedMessage = message.trim();

        if (trimmedMessage.length > MESSAGE_LIMIT) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.MESSAGE_CANNOT_EXCEED_2000_CHARACTERS,
            });
        }

        const reply = await generateAIResponse({
            message: trimmedMessage,
            role: "PUBLIC",
        });

        if (!reply || !reply.trim()) {
            throw new Error("AI could not generate a response. Please try again.");
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.AI_RESPONSE_GENERATED,
            data: {
                reply: reply.trim(),
            },
        });
    } catch (error) {
        next(error);
    }
};

export { chatWithAI, chatWithPublicAI, getAIConversation };
