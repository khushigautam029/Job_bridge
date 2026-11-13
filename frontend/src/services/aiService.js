
import api from "./api";

// Fetch the logged-in user's previous AI conversation
export const getAIConversation = async () => {
    const response = await api.get("/ai/conversation");

    return response.data?.data;
};

// Send a message to the AI assistant
export const sendAIMessage = async (message) => {
    const response = await api.post("/ai/chat", {
        message,
    });

    return response.data?.data;
};

// Send a public, unauthenticated question about JobBridge.
export const sendPublicAIMessage = async (message) => {
    const response = await api.post("/ai/public-chat", {
        message,
    });

    return response.data?.data;
};