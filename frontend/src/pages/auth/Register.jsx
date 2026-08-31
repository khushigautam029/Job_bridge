import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Check,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    User,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [accountType, setAccountType] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",

        qualification: "",
        experience: "",
        primarySkill: "",

        companyName: "",
        designation: "",
        website: "",
    });

    const [termsAccepted, setTermsAccepted] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const candidateFields = [
        "Create your professional profile",
        "Add your skills and experience",
        "Discover jobs matching your profile",
    ];

    const recruiterFields = [
        "Create your recruiter profile",
        "Manage your company and jobs",
        "Find candidates matching your requirements",
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!termsAccepted) {
            setError(
                "Please accept the Terms of Service and Privacy Policy."
            );
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (accountType === "recruiter" &&
            !formData.companyName.trim()) {
            setError("Company name is required.");
            return;
        }

        setLoading(true);

        try {
            const userData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                role:
                    accountType === "candidate"
                        ? "CANDIDATE"
                        : "RECRUITER",
            };

            if (accountType === "recruiter") {
                userData.companyName =
                    formData.companyName.trim();
            }

            const response =
                await registerUser(userData);

            const { token, user } =
                response.data;

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            setSuccess(
                "Registration successful! Redirecting..."
            );

            if (user.role === "CANDIDATE") {
                navigate("/candidate/dashboard");
            } else if (
                user.role === "RECRUITER"
            ) {
                navigate("/recruiter/dashboard");
            }
        } catch (error) {
            setError(
                error.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job<span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </div>

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

            <main className="px-6 py-10 lg:px-8 lg:py-14">
                <div className="mx-auto max-w-5xl">

                    {!accountType ? (
                        <div className="mx-auto max-w-3xl">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-indigo-600">
                                    Join JobBridge
                                </p>

                                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Create your account
                                </h1>

                                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                                    Choose the type of account you want to
                                    create. Your experience will be customized
                                    based on your role.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-5 md:grid-cols-2">

                                {/* Candidate */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAccountType(
                                            "candidate"
                                        )
                                    }
                                    className="group rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-slate-200/60"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                            <User size={27} />
                                        </div>

                                        <ArrowRight
                                            size={20}
                                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                        />
                                    </div>

                                    <h2 className="mt-7 text-xl font-bold text-slate-900">
                                        I'm a Candidate
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        I'm looking for job opportunities and
                                        want to build my career.
                                    </p>

                                    <div className="mt-6 space-y-3">
                                        {candidateFields.map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center gap-2 text-sm text-slate-600"
                                                >
                                                    <Check
                                                        size={16}
                                                        className="text-indigo-600"
                                                    />
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-7 text-sm font-semibold text-indigo-600">
                                        Continue as Candidate →
                                    </div>
                                </button>

                                {/* Recruiter */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAccountType(
                                            "recruiter"
                                        )
                                    }
                                    className="group rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-slate-200/60"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                            <Building2 size={27} />
                                        </div>

                                        <ArrowRight
                                            size={20}
                                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                        />
                                    </div>

                                    <h2 className="mt-7 text-xl font-bold text-slate-900">
                                        I'm a Recruiter
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        I'm hiring talent and looking for
                                        skilled candidates for my company.
                                    </p>

                                    <div className="mt-6 space-y-3">
                                        {recruiterFields.map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center gap-2 text-sm text-slate-600"
                                                >
                                                    <Check
                                                        size={16}
                                                        className="text-indigo-600"
                                                    />
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-7 text-sm font-semibold text-indigo-600">
                                        Continue as Recruiter →
                                    </div>
                                </button>
                            </div>

                            <p className="mt-8 text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-4xl">

                            <button
                                type="button"
                                onClick={() =>
                                    setAccountType(null)
                                }
                                className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                            >
                                <ArrowLeft size={17} />
                                Change account type
                            </button>

                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                                <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

                                    {/* Sidebar */}
                                    <div className="bg-indigo-600 p-8 text-white sm:p-10">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                            {accountType ===
                                            "candidate" ? (
                                                <User size={24} />
                                            ) : (
                                                <Building2 size={24} />
                                            )}
                                        </div>

                                        <p className="mt-7 text-sm font-medium text-indigo-100">
                                            Creating a{" "}
                                            {accountType ===
                                            "candidate"
                                                ? "Candidate"
                                                : "Recruiter"}{" "}
                                            account
                                        </p>

                                        <h1 className="mt-2 text-3xl font-bold leading-tight">
                                            {accountType ===
                                            "candidate"
                                                ? "Start your career journey."
                                                : "Build your hiring team."}
                                        </h1>

                                        <p className="mt-4 text-sm leading-6 text-indigo-100">
                                            {accountType ===
                                            "candidate"
                                                ? "Create your profile, showcase your skills, and discover opportunities that match your career goals."
                                                : "Create your recruiter profile, represent your company, and connect with candidates who match your hiring needs."}
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <div className="p-7 sm:p-10">

                                        <h2 className="text-2xl font-bold text-slate-900">
                                            Create your{" "}
                                            {accountType ===
                                            "candidate"
                                                ? "candidate"
                                                : "recruiter"}{" "}
                                            account
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Fill in your details to get
                                            started.
                                        </p>

                                        {error && (
                                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                                {error}
                                            </div>
                                        )}

                                        {success && (
                                            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                                                {success}
                                            </div>
                                        )}

                                        <form
                                            onSubmit={
                                                handleRegister
                                            }
                                            className="mt-7 space-y-5"
                                        >

                                            {/* Name */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Full name
                                                </label>

                                                <div className="relative">
                                                    <User
                                                        size={18}
                                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />

                                                    <input
                                                        name="name"
                                                        type="text"
                                                        value={
                                                            formData.name
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Enter your full name"
                                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Email address
                                                </label>

                                                <div className="relative">
                                                    <Mail
                                                        size={18}
                                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />

                                                    <input
                                                        name="email"
                                                        type="email"
                                                        value={
                                                            formData.email
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Enter your email"
                                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Phone number
                                                </label>

                                                <div className="relative">
                                                    <Phone
                                                        size={18}
                                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />

                                                    <input
                                                        name="phone"
                                                        type="tel"
                                                        value={
                                                            formData.phone
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Enter your phone number"
                                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                    />
                                                </div>
                                            </div>

                                            {/* Candidate fields */}
                                            {accountType ===
                                                "candidate" && (
                                                <>
                                                    <div>
                                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                            Highest qualification
                                                        </label>

                                                        <select
                                                            name="qualification"
                                                            value={
                                                                formData.qualification
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        >
                                                            <option value="">
                                                                Select
                                                                qualification
                                                            </option>
                                                            <option>
                                                                High School
                                                            </option>
                                                            <option>
                                                                Diploma
                                                            </option>
                                                            <option>
                                                                Bachelor's
                                                            </option>
                                                            <option>
                                                                Master's
                                                            </option>
                                                            <option>
                                                                PhD
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                            Experience
                                                        </label>

                                                        <select
                                                            name="experience"
                                                            value={
                                                                formData.experience
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        >
                                                            <option value="">
                                                                Select
                                                                experience
                                                            </option>
                                                            <option>
                                                                Fresher
                                                            </option>
                                                            <option>
                                                                1 - 2 Years
                                                            </option>
                                                            <option>
                                                                3 - 5 Years
                                                            </option>
                                                            <option>
                                                                5 - 8 Years
                                                            </option>
                                                            <option>
                                                                8+ Years
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                            Primary skill
                                                        </label>

                                                        <input
                                                            name="primarySkill"
                                                            type="text"
                                                            value={
                                                                formData.primarySkill
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            placeholder="e.g. React, Node.js, Java"
                                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Recruiter fields */}
                                            {accountType ===
                                                "recruiter" && (
                                                <>
                                                    <div>
                                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                            Company name
                                                        </label>

                                                        <div className="relative">
                                                            <Building2
                                                                size={18}
                                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                            />

                                                            <input
                                                                name="companyName"
                                                                type="text"
                                                                value={
                                                                    formData.companyName
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                placeholder="Enter company name"
                                                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                            Designation
                                                        </label>

                                                        <input
                                                            name="designation"
                                                            type="text"
                                                            value={
                                                                formData.designation
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            placeholder="e.g. HR Manager, Recruiter"
                                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                            Company website
                                                        </label>

                                                        <input
                                                            name="website"
                                                            type="url"
                                                            value={
                                                                formData.website
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            placeholder="https://example.com"
                                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Password */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Password
                                                </label>

                                                <div className="relative">
                                                    <LockKeyhole
                                                        size={18}
                                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />

                                                    <input
                                                        name="password"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            formData.password
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Create a password"
                                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        required
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirm password */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Confirm password
                                                </label>

                                                <div className="relative">
                                                    <LockKeyhole
                                                        size={18}
                                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />

                                                    <input
                                                        name="confirmPassword"
                                                        type={
                                                            showConfirmPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            formData.confirmPassword
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Confirm your password"
                                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                        required
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword
                                                            )
                                                        }
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Terms */}
                                            <label className="flex cursor-pointer items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        termsAccepted
                                                    }
                                                    onChange={(e) =>
                                                        setTermsAccepted(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />

                                                <span className="text-xs leading-5 text-slate-500">
                                                    I agree to the JobBridge{" "}
                                                    <button
                                                        type="button"
                                                        className="font-semibold text-indigo-600 hover:underline"
                                                    >
                                                        Terms of Service
                                                    </button>{" "}
                                                    and{" "}
                                                    <button
                                                        type="button"
                                                        className="font-semibold text-indigo-600 hover:underline"
                                                    >
                                                        Privacy Policy
                                                    </button>
                                                    .
                                                </span>
                                            </label>

                                            {/* Submit */}
                                            <button
                                                type="submit"
                                                disabled={
                                                    loading
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {loading
                                                    ? "Creating account..."
                                                    : `Create ${
                                                          accountType ===
                                                          "candidate"
                                                              ? "Candidate"
                                                              : "Recruiter"
                                                      } Account`}

                                                {!loading && (
                                                    <ArrowRight
                                                        size={17}
                                                    />
                                                )}
                                            </button>
                                        </form>

                                        <p className="mt-6 text-center text-sm text-slate-500">
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        "/login"
                                                    )
                                                }
                                                className="font-semibold text-indigo-600 hover:text-indigo-700"
                                            >
                                                Sign in
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Register;