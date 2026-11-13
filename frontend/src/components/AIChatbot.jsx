
import {
    Bot,
    MessageCircle,
    Minimize2,
    Send,
    Sparkles,
    X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import {
    getAIConversation,
    sendAIMessage,
    sendPublicAIMessage,
} from "../services/aiService";

const AIChatbot = ({ role = "CANDIDATE" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingConversation, setIsLoadingConversation] = useState(false);
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const hasLoadedConversation = useRef(false);

    // Normalize role to avoid case-related issues
    const userRole = role?.toUpperCase();

    const isPublic = !["CANDIDATE", "RECRUITER"].includes(userRole);
    const isCandidate = userRole === "CANDIDATE";

    const welcomeMessage = isPublic
        ? "Hi! Welcome to JobBridge 👋 I'm your AI assistant. Feel free to ask me about JobBridge, its features, and how to get started. For personalized candidate or recruiter assistance, you'll need to log in first."
        : isCandidate
            ? "Hi! I'm JobBridge AI 👋 I'm here to help you with your career journey. You can ask me about resumes, interviews, job searching, or skill development."
            : "Hi! I'm JobBridge AI 👋 I can help you with job descriptions, hiring requirements, interview questions, and recruitment strategies.";

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isTyping, isOpen]);

    // Focus input when chatbot opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // Load conversation history for logged-in users
    useEffect(() => {
        if (!isOpen || isPublic || hasLoadedConversation.current) {
            return;
        }

        let isActive = true;
        let isSettled = false;

        hasLoadedConversation.current = true;
        setIsLoadingConversation(true);

        const loadConversation = async () => {
            try {
                const conversation = await getAIConversation();
                const conversationMessages = conversation?.messages;

                if (!Array.isArray(conversationMessages)) {
                    throw new Error("The conversation response was invalid.");
                }

                if (isActive) {
                    setMessages(
                        conversationMessages.map((item) => ({
                            id: item.id,
                            sender: item.sender,
                            message: item.message,
                        }))
                    );
                }
            } catch (error) {
                if (isActive) {
                    hasLoadedConversation.current = false;

                    setMessages((previous) => [
                        ...previous,
                        {
                            id: Date.now(),
                            sender: "AI",
                            message:
                                error.response?.data?.message ||
                                error.message ||
                                "Unable to load your previous conversation. You can still send a message.",
                        },
                    ]);
                }
            } finally {
                isSettled = true;

                if (isActive) {
                    setIsLoadingConversation(false);
                }
            }
        };

        loadConversation();

        return () => {
            isActive = false;

            if (!isSettled) {
                hasLoadedConversation.current = false;
            }
        };
    }, [isOpen, isPublic]);

    // Send a message
    const handleSendMessage = async (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (
            !trimmedMessage ||
            isTyping ||
            isLoadingConversation
        ) {
            return;
        }

        const userMessage = {
            id: Date.now(),
            sender: "USER",
            message: trimmedMessage,
        };

        setMessages((previous) => [
            ...previous,
            userMessage,
        ]);

        setMessage("");
        setIsTyping(true);

        try {
            const result = isPublic
                ? await sendPublicAIMessage(trimmedMessage)
                : await sendAIMessage(trimmedMessage);
            const reply = result?.reply;

            if (typeof reply !== "string" || !reply.trim()) {
                throw new Error(
                    "The AI assistant returned an empty response."
                );
            }

            const aiMessage = {
                id: result?.aiMessage?.id || Date.now() + 1,
                sender: "AI",
                message: reply.trim(),
            };

            setMessages((previous) => [
                ...previous,
                aiMessage,
            ]);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                (error.response
                    ? "The AI assistant couldn't process your message. Please try again."
                    : "Couldn't connect to the AI assistant. Check your connection and try again.");

            setMessages((previous) => [
                ...previous,
                {
                    id: Date.now() + 1,
                    sender: "AI",
                    message: errorMessage,
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* FLOATING CHATBOT BUTTON */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open JobBridge AI assistant"
                    title="Chat with JobBridge AI"
                    className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-110 hover:bg-indigo-700 active:scale-95"
                >
                    <MessageCircle size={25} />

                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                </button>
            )}

            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-[100] flex h-[min(600px,calc(100vh-48px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">

                    {/* HEADER */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                                <Bot size={23} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold">
                                    JobBridge AI
                                </h3>

                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-300" />

                                    <span className="text-[11px] text-indigo-100">
                                        {isPublic
                                            ? "Guest Assistant"
                                            : isCandidate
                                                ? "Your Career Assistant"
                                                : "Your Recruitment Assistant"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Minimize chatbot"
                                className="rounded-lg p-2 text-white/90 transition hover:bg-white/15"
                            >
                                <Minimize2 size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chatbot"
                                className="rounded-lg p-2 text-white/90 transition hover:bg-white/15"
                            >
                                <X size={19} />
                            </button>
                        </div>
                    </div>

                    {/* MESSAGES AREA */}
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-slate-50 px-4 py-5">

                        {/* WELCOME MESSAGE */}
                        <div className="flex items-start gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <Sparkles size={16} />
                            </div>

                            <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
                                <p className="mb-1 text-xs font-semibold text-indigo-600">
                                    JobBridge AI
                                </p>

                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                    {welcomeMessage}
                                </p>
                            </div>
                        </div>

                        {/* LOADING CONVERSATION */}
                        {isLoadingConversation && (
                            <p className="text-center text-xs text-slate-400">
                                Loading your previous conversation...
                            </p>
                        )}

                        {/* CONVERSATION MESSAGES */}
                        {messages.map((item) => {
                            const isUser = item.sender === "USER";

                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-start gap-2.5 ${
                                        isUser
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {!isUser && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                            <Bot size={16} />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[85%] rounded-2xl px-3.5 py-3 shadow-sm ${
                                            isUser
                                                ? "rounded-tr-sm bg-indigo-600 text-white"
                                                : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                                        }`}
                                    >
                                        {!isUser && (
                                            <p className="mb-1 text-xs font-semibold text-indigo-600">
                                                JobBridge AI
                                            </p>
                                        )}

                                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                            {item.message}
                                        </p>
                                    </div>

                                    {isUser && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                                            <span className="text-xs font-semibold">
                                                You
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* TYPING INDICATOR */}
                        {isTyping && (
                            <div className="flex items-start gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <Bot size={16} />
                                </div>

                                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT AREA */}
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-slate-200 bg-white p-3"
                    >
                        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                            <textarea
                                ref={inputRef}
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        !event.shiftKey
                                    ) {
                                        event.preventDefault();
                                        event.currentTarget.form?.requestSubmit();
                                    }
                                }}
                                placeholder={
                                    isPublic
                                        ? "Ask about JobBridge..."
                                        : "Ask me anything..."
                                }
                                rows={1}
                                maxLength={2000}
                                disabled={
                                    isTyping || isLoadingConversation
                                }
                                className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-60"
                            />

                            <button
                                type="submit"
                                disabled={
                                    !message.trim() ||
                                    isTyping ||
                                    isLoadingConversation
                                }
                                aria-label="Send message"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                <Send size={17} />
                            </button>
                        </div>

                        <p className="mt-2 text-center text-[10px] text-slate-400">
                            {isPublic
                                ? "Guest Mode · Log in for personalized assistance"
                                : "JobBridge AI can make mistakes. Verify important information."}
                        </p>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIChatbot;