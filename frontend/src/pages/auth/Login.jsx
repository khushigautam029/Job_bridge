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

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job<span className="text-indigo-600">Bridge</span>
                        </span>
                    </div>

                    {/* Back to home */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Home
                    </button>
                </div>
            </header>

            {/* Login Section */}
            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-2">
                    {/* Left Content */}
                    <div className="hidden bg-indigo-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                <BriefcaseBusiness size={25} />
                            </div>

                            <h1 className="mt-8 text-4xl font-bold leading-tight">
                                Welcome back to JobBridge.
                            </h1>

                            <p className="mt-5 max-w-md text-sm leading-6 text-indigo-100">
                                Continue your career journey, discover new
                                opportunities, and stay connected with
                                companies looking for talented people.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                                    ✓
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        Find better opportunities
                                    </p>

                                    <p className="mt-1 text-sm text-indigo-100">
                                        Discover jobs based on your skills.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                                    ✓
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        Track your applications
                                    </p>

                                    <p className="mt-1 text-sm text-indigo-100">
                                        Keep your entire application journey
                                        organized.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                                    ✓
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        Connect with companies
                                    </p>

                                    <p className="mt-1 text-sm text-indigo-100">
                                        Build meaningful career connections.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Login Form */}
                    <div className="p-7 sm:p-10 lg:p-12">
                        <div className="mx-auto max-w-md">
                            {/* Heading */}
                            <div>
                                <p className="text-sm font-semibold text-indigo-600">
                                    Welcome back
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                    Sign in to your account
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Enter your details to continue to
                                    JobBridge.
                                </p>
                            </div>

                            {/* Form */}
                            <form className="mt-8 space-y-5">
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>

                                        <button
                                            type="button"
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={18}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between">
                                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />

                                        Remember me
                                    </label>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Sign In
                                </button>
                            </form>

                            {/* Register */}
                            <div className="mt-7 text-center">
                                <p className="text-sm text-slate-500">
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => navigate("/register")}
                                        className="font-semibold text-indigo-600 hover:text-indigo-700"
                                    >
                                        Create an account
                                    </button>
                                </p>
                            </div>

                            {/* Role information */}
                            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs leading-5 text-slate-500">
                                    <span className="font-semibold text-slate-700">
                                        One account, personalized experience.
                                    </span>{" "}
                                    After signing in, you'll automatically be
                                    taken to the appropriate dashboard based
                                    on your account type.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;