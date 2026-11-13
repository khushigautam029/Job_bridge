
import {
    Bot,
    MessageCircle,
    Minimize2,
    Send,
    Sparkles,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// PUBLIC MODE: predefined answers for visitors who are not logged in.
const getGuestResponse = (message) => {
    const text = message.toLowerCase().trim();

    // Questions requiring an authenticated account
    const personalQuestionPatterns = [
        /\bmy (application|applications|resume|profile|account|dashboard|interview|interviews|saved jobs|job status|candidates|applicants|company)\b/,
        /\b(check|show|track|update|view) my\b/,
        /\b(application|interview|resume|profile) status\b/,
        /\brecommend (me|jobs for me)\b/,
        /\bmy job application\b/,
        /\bmy interview schedule\b/,
        /\bmy recruiter dashboard\b/,
        /\bmy candidate dashboard\b/,
        /\bwho applied to my job\b/,
    ];

    if (personalQuestionPatterns.some((pattern) => pattern.test(text))) {
        return "I'd be happy to help with that! However, this requires access to your personal JobBridge account. Please log in or create an account first. Once you're logged in, I can help you with the relevant candidate or recruiter features. 😊";
    }

    // What is JobBridge?
    if (
        /\b(what is|about|explain|tell me about)\b/.test(text) &&
        /\b(jobbridge|this platform|this website|this application|this app)\b/.test(text)
    ) {
        return "JobBridge is an online job portal designed to connect job seekers with recruiters. Candidates can explore job opportunities, apply for suitable positions, save jobs, and manage their recruitment journey. Recruiters can publish job openings and manage applications and candidates through one platform.";
    }

    // Purpose of the application
    if (
        /\b(why|purpose|reason)\b/.test(text) &&
        /\b(created|made|built|developed|application|website|jobbridge|platform)\b/.test(text)
    ) {
        return "JobBridge was created to make the job search and recruitment process easier and more organized. It provides a common platform where candidates can discover opportunities and recruiters can manage their hiring activities efficiently.";
    }

    // Features and modules
    if (
        /\b(feature|features|include|includes|modules|functionality|capabilities|what can)\b/.test(text)
    ) {
        return "JobBridge includes two main sections:\n\n👩‍💻 Candidate features:\n• Find and explore jobs\n• Apply for jobs\n• Save jobs for later\n• Manage applications\n• View interview information\n• Manage your profile\n\n🏢 Recruiter features:\n• Post and manage jobs\n• View applications\n• Explore candidates\n• Manage interviews\n• Manage recruiter profiles\n\nSome features require you to log in.";
    }

    // Candidate and recruiter difference
    if (
        /\b(candidate|recruiter)\b/.test(text) &&
        /\b(difference|roles|types|both|mean|means)\b/.test(text)
    ) {
        return "JobBridge supports two main account types:\n\n👩‍💻 Candidate: A person looking for job opportunities. Candidates can search and apply for jobs, save jobs, and manage their applications.\n\n🏢 Recruiter: A person or organization looking to hire candidates. Recruiters can post jobs, review applications, and manage their hiring process.";
    }

    // Registration
    if (
        /\b(register|registration|sign up|signup|create account|create an account)\b/.test(text)
    ) {
        return "Creating a JobBridge account is simple!\n\n1. Visit the Register page.\n2. Choose whether you want to register as a Candidate or Recruiter.\n3. Enter the required details.\n4. Complete the registration process.\n5. Log in to access your account features.\n\nYou can get started here: /register";
    }

    // Login
    if (
        /\b(login|log in|sign in|signin)\b/.test(text)
    ) {
        return "If you already have a JobBridge account, visit the Login page and enter your registered email and password. If you don't have an account yet, you can create one first.\n\nLogin: /login\nRegister: /register";
    }

    // Job search
    if (
        /\b(find jobs|search jobs|job search|job opportunities|available jobs|browse jobs)\b/.test(text)
    ) {
        return "You can explore job opportunities through the Find Jobs section. Browse available listings and explore job details to learn more about each opportunity. To apply for jobs and manage your applications, you'll need a Candidate account.";
    }

    // Recruiter information
    if (
        /\b(recruiter|employer|hiring|hire candidates|post jobs|post a job)\b/.test(text)
    ) {
        return "JobBridge provides recruiters with tools to publish job openings, review candidate applications, explore candidates, and manage interviews. You'll need to create a Recruiter account and log in to use these features.";
    }

    // Contact information
    if (
        /\b(contact|support|help|reach you|customer service)\b/.test(text)
    ) {
        return "You can visit the Contact Us page on JobBridge to find information about contacting the platform team. You can also explore the About Us and Features pages to learn more about the platform.";
    }

    // Greetings
    if (
        /^(hi|hello|hey|good morning|good afternoon|good evening)[!. ]*$/.test(text)
    ) {
        return "Hello! 👋 Welcome to JobBridge. I'm here to answer your general questions about the platform, its features, and how to get started. What would you like to know?";
    }

    // Questions outside public FAQ scope
    return "I'm currently available in Guest Mode, so I can answer general questions about JobBridge, its features, and how to get started.\n\nFor personalized assistance, such as managing applications, checking interview details, accessing candidate features, or using recruiter tools, please log in or create an account first.\n\nYou can ask me things like:\n• What is JobBridge?\n• Why was JobBridge created?\n• What features does it include?\n• How can I register?";
};

const AIChatbot = ({ role = "CANDIDATE" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const isPublic = role === "PUBLIC";
    const isCandidate = role === "CANDIDATE";

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

    const handleSendMessage = (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || isTyping) return;

        const userMessage = {
            id: Date.now(),
            sender: "USER",
            message: trimmedMessage,
        };

        setMessages((previous) => [...previous, userMessage]);
        setMessage("");
        setIsTyping(true);

        // Temporary public FAQ responses
        // Candidate and Recruiter responses will be connected to Gemini later.
        setTimeout(() => {
            const response = isPublic
                ? getGuestResponse(trimmedMessage)
                : "Thanks for your message! I'll be able to assist you with this once the Gemini backend integration is connected.";

            const aiMessage = {
                id: Date.now() + 1,
                sender: "AI",
                message: response,
            };

            setMessages((previous) => [...previous, aiMessage]);
            setIsTyping(false);
        }, 700);
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

                        {/* CONVERSATION MESSAGES */}
                        {messages.map((item) => {
                            const isUser = item.sender === "USER";

                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-start gap-2.5 ${
                                        isUser ? "justify-end" : "justify-start"
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
                                disabled={isTyping}
                                className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-60"
                            />

                            <button
                                type="submit"
                                disabled={!message.trim() || isTyping}
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
