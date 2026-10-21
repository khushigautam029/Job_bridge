import {
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError(
                "This password reset link is invalid. Please request a new one."
            );
            return;
        }

        if (formData.password.length < 8) {
            setError("Your password must contain at least 8 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("The passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword(
                token,
                formData.password
            );

            setSuccess(
                response?.message ||
                    "Your password has been reset successfully."
            );

            setFormData({
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to reset your password. The link may have expired."
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
                            <LockKeyhole size={23} />
                        </div>

                        <div className="mt-5">
                            <p className="text-sm font-semibold text-indigo-600">
                                Account security
                            </p>

                            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
                                Reset your password
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Create a new password for your JobBridge
                                account. Use at least 8 characters.
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700"
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

                        {!success && (
                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                    >
                                        New password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={17}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            autoComplete="new-password"
                                            minLength={8}
                                            maxLength={100}
                                            required
                                            disabled={loading}
                                            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) => !previous
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                    >
                                        Confirm new password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={17}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Re-enter new password"
                                            autoComplete="new-password"
                                            minLength={8}
                                            maxLength={100}
                                            required
                                            disabled={loading}
                                            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (previous) => !previous
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Resetting password..."
                                        : "Reset Password"}
                                </button>
                            </form>
                        )}

                        {success ? (
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="mt-5 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Continue to Login
                            </button>
                        ) : (
                            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                                <p className="text-sm text-slate-500">
                                    Need a new reset link?{" "}
                                    <Link
                                        to="/forgot-password"
                                        className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                                    >
                                        Try again
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                        Reset links expire after 15 minutes and can only be
                        used once.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;