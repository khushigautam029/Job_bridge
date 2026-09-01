import {
    ArrowLeft,
    BriefcaseBusiness,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
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
            const storage = rememberMe
                ? localStorage
                : sessionStorage;

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
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-7 lg:px-8">

                    {/* LOGO */}

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
                            <span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </button>

                    {/* BACK */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">
                            Back to Home
                        </span>
                    </button>
                </div>
            </header>

            {/* =================================================
                LOGIN CONTENT
            ================================================= */}

            <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-8">

                <div className="w-full max-w-md">

                    {/* CARD */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">

                        {/* ICON */}

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <LockKeyhole size={21} />
                        </div>

                        {/* HEADING */}

                        <div className="mt-5">
                            <p className="text-sm font-semibold text-indigo-600">
                                Welcome back
                            </p>

                            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
                                Sign in to JobBridge
                            </h1>

                            <p className="mt-2 text-sm leading-5 text-slate-500">
                                Sign in to continue your career journey.
                            </p>
                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* FORM */}

                        <form
                            onSubmit={handleLogin}
                            className="mt-6 space-y-4"
                        >

                            {/* EMAIL */}

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
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Password
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
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
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

                            {/* REMEMBER ME */}

                            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(event) =>
                                        setRememberMe(
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />

                                Remember me
                            </label>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign In"}
                            </button>
                        </form>

                        {/* REGISTER */}

                        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                                >
                                    Create an account
                                </button>
                            </p>
                        </div>

                    </div>

                    {/* SECURITY MESSAGE */}

                    <p className="mt-4 text-center text-xs text-slate-400">
                        Your account information is securely protected.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Login;
