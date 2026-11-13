import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";;

const generateAIResponse = async ({ message, history, role }) => {
    const systemInstruction =
        role === "CANDIDATE"
            ? `You are JobBridge AI, a friendly career assistant for candidates.

Help candidates with:
- Job searching and career guidance.
- Resume improvement suggestions.
- Interview preparation.
- Skills and career development.
- Understanding recruitment processes.

Give clear, practical and beginner-friendly answers.
Do not invent job listings or claim access to JobBridge database information.
You are an assistant within JobBridge.`
            : `You are JobBridge AI, a professional recruitment assistant for recruiters.

Help recruiters with:
- Writing job descriptions.
- Defining job requirements and skills.
- Recruitment strategies.
- Interview questions.
- Hiring best practices.

Give clear, professional and practical answers.
Do not invent candidate or application information.
You are an assistant within JobBridge.`;

    const contents = [
        ...history.map((item) => ({
            role: item.role,
            parts: [{ text: item.text }],
        })),
        {
            role: "user",
            parts: [{ text: message }],
        },
    ];

    const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 800,
        },
    });

    return response.text;
};

export default generateAIResponse;
