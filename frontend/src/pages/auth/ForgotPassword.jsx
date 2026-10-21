import {
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    Mail,
    Send,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await forgotPassword(email.trim());

            setSuccess(
                response?.message ||
                    "If an account exists with this email, you will receive a password reset link."
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to send the reset link. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-7 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job
                            <span className="text-indigo-600">Bridge</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </button>
                </div>
            </header>

            <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Mail size={23} />
                        </div>

                        <div className="mt-5">
                            <p className="text-sm font-semibold text-indigo-600">
                                Account recovery
                            </p>

                            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
                                Forgot your password?
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Enter the email address associated with your
                                JobBridge account. If the account exists,
                                we’ll send you a link to reset your password.
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                role="status"
                                className="mt-5 flex gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 text-sm leading-5 text-green-700"
                            >
                                <CheckCircle2
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                            setError("");
                                            setSuccess("");
                                        }}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                        disabled={loading}
                                        className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Send size={16} />
                                {loading
                                    ? "Sending reset link..."
                                    : "Send Reset Link"}
                            </button>
                        </form>

                        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                            <p className="text-sm text-slate-500">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                        For your security, password reset links expire after
                        15 minutes.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;