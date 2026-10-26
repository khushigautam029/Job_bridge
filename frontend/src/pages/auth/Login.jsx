import {
    ArrowRight,
    BriefcaseBusiness,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await loginUser({
                email: formData.email.trim(),
                password: formData.password,
            });

            const { token, user } = response.data;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem("token", token);
            storage.setItem("user", JSON.stringify(user));

            sessionStorage.setItem(
                "authSuccessMessage",
                `Welcome back, ${user.name || "User"}! You have logged in successfully.`
            );

            navigate("/");
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="jobbridge-login flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
            <style>{`
                @keyframes loginHeaderEnter {
                    from {
                        opacity: 0;
                        transform: translateY(-14px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes loginCardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(24px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes loginContentEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes loginIconFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-4px);
                    }
                }

                @keyframes loginOrbFloat {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(-12px, 10px);
                    }
                }

                .jobbridge-login .login-header {
                    animation: loginHeaderEnter 0.55s ease-out both;
                }

                .jobbridge-login .login-card {
                    animation: loginCardEnter 0.65s cubic-bezier(0.2, 0.7, 0.3, 1) both;
                }

                .jobbridge-login .login-content {
                    animation: loginContentEnter 0.5s ease-out both;
                }

                .jobbridge-login .login-delay-1 {
                    animation-delay: 0.08s;
                }

                .jobbridge-login .login-delay-2 {
                    animation-delay: 0.16s;
                }

                .jobbridge-login .login-delay-3 {
                    animation-delay: 0.24s;
                }

                .jobbridge-login .login-delay-4 {
                    animation-delay: 0.32s;
                }

                .jobbridge-login .login-delay-5 {
                    animation-delay: 0.4s;
                }

                .jobbridge-login .login-logo-icon {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .jobbridge-login .login-logo:hover .login-logo-icon {
                    transform: rotate(-7deg) scale(1.06);
                    box-shadow: 0 0 0 5px rgb(99 102 241 / 12%);
                }

                .jobbridge-login .login-nav-link {
                    position: relative;
                    transition: color 0.2s ease, transform 0.2s ease;
                }

                .jobbridge-login .login-nav-link::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -5px;
                    height: 2px;
                    border-radius: 999px;
                    background: #4f46e5;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.25s ease;
                }

                .jobbridge-login .login-nav-link:hover {
                    transform: translateY(-1px);
                }

                .jobbridge-login .login-nav-link:hover::after {
                    transform: scaleX(1);
                }

                .jobbridge-login .login-field {
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .jobbridge-login .login-submit {
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                }

                .jobbridge-login .login-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgb(79 70 229 / 20%);
                }

                .jobbridge-login .login-submit:active:not(:disabled) {
                    transform: translateY(0);
                }

                .jobbridge-login .login-decoration {
                    animation: loginOrbFloat 8s ease-in-out infinite;
                }

                .jobbridge-login .login-security-icon {
                    animation: loginIconFloat 4s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .jobbridge-login *,
                    .jobbridge-login *::before,
                    .jobbridge-login *::after {
                        animation: none !important;
                        transition: none !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

            {/* NAVBAR */}
            <header className="login-header sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-7 lg:px-8">
                    {/* LOGO */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="login-logo flex shrink-0 items-center gap-2"
                        aria-label="JobBridge home"
                    >
                        <div className="login-logo-icon flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                            Job
                            <span className="text-indigo-600">Bridge</span>
                        </span>
                    </button>

                    {/* AUTH ACTIONS */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 sm:px-4"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="group inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md sm:px-4"
                        >
                            <span>Get Started</span>
                            <ArrowRight
                                size={15}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN LOGIN AREA */}
            <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-10 mt-1">
                {/* BACKGROUND DECORATION */}
                <div className="login-decoration pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="login-decoration pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

                <div className="relative z-10 w-full max-w-md">
                    {/* LOGIN CARD */}
                    <div className="login-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                        {/* ICON */}
                        <div className="login-content login-security-icon flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <LockKeyhole size={22} />
                        </div>

                        {/* HEADING */}
                        <div className="login-content login-delay-1 mt-4">
                            <p className="text-sm font-semibold text-indigo-600">
                                Welcome back
                            </p>

                            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Sign in to JobBridge
                            </h1>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div
                                role="alert"
                                className="mt-5 animate-[loginContentEnter_0.25s_ease-out] rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-600"
                            >
                                {error}
                            </div>
                        )}

                        {/* LOGIN FORM */}
                        <form
                            onSubmit={handleLogin}
                            className="mt-5 space-y-4"
                        >
                            {/* EMAIL */}
                            <div className="login-content login-delay-2">
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="login-field w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="login-content login-delay-3">
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="login-field w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* FORGOT PASSWORD */}
                            <div className="login-content login-delay-3 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* REMEMBER ME */}
                            <label className="login-content login-delay-4 flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(event) =>
                                        setRememberMe(event.target.checked)
                                    }
                                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />

                                Remember me
                            </label>

                            {/* SUBMIT BUTTON */}
                            <div className="login-content login-delay-5 pt-1">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="login-submit w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? (
                                        <span className="inline-flex items-center justify-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center gap-2">
                                            Sign In
                                            <ArrowRight size={16} />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* REGISTER LINK */}
                        <div className="login-content login-delay-5 mt-3 border-t border-slate-100 pt-5 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                                >
                                    Create an account
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;