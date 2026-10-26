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
        companyName: "",
        companyType: "",
        designation: "",
        website: "",
    });

    const [touched, setTouched] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsTouched, setTermsTouched] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const hasInvalidSpaces = (value) =>
        /^\s/.test(value) ||
        /\s$/.test(value) ||
        /\s{2,}/.test(value);

    const validateName = (value) => {
        if (!value.trim()) {
            return "Full name is required.";
        }

        if (value.length > 30) {
            return "Full name must not exceed 30 characters.";
        }

        if (hasInvalidSpaces(value)) {
            return "Only one space is allowed between words.";
        }

        if (!/^[A-Za-z][A-Za-z.' -]*$/.test(value)) {
            return "Name can contain only letters and valid name characters.";
        }

        return "";
    };

    const validateEmail = (value) => {
        if (!value.trim()) {
            return "Email address is required.";
        }

        const emailRegex =
            /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

        if (!emailRegex.test(value.trim())) {
            return "Please enter a valid email address.";
        }

        return "";
    };

    const validatePhone = (value) => {
        if (!value.trim()) {
            return "";
        }

        if (!/^[0-9]{10}$/.test(value.trim())) {
            return "Phone number must contain exactly 10 digits.";
        }

        return "";
    };

    const validatePassword = (value) => {
        if (!value) {
            return "Password is required.";
        }

        if (value.length < 8) {
            return "Password must be at least 8 characters.";
        }

        return "";
    };

    const validateConfirmPassword = (value) => {
        if (!value) {
            return "Please confirm your password.";
        }

        if (value !== formData.password) {
            return "Passwords do not match.";
        }

        return "";
    };

    const validateCompanyName = (value) => {
        if (!value.trim()) {
            return "Company name is required.";
        }

        if (value.length > 100) {
            return "Company name must not exceed 100 characters.";
        }

        if (hasInvalidSpaces(value)) {
            return "Only one space is allowed between words.";
        }

        if (!/^[A-Za-z0-9][A-Za-z0-9&.,'()\- ]*$/.test(value)) {
            return "Company name contains invalid characters.";
        }

        return "";
    };

    const validateDesignation = (value) => {
        if (!value.trim()) {
            return "";
        }

        if (value.length > 100) {
            return "Designation must not exceed 100 characters.";
        }

        if (hasInvalidSpaces(value)) {
            return "Only one space is allowed between words.";
        }

        if (!/^[A-Za-z0-9&.,'()\- ]*$/.test(value)) {
            return "Designation contains invalid characters.";
        }

        return "";
    };

    const validateWebsite = (value) => {
        if (!value.trim()) {
            return "";
        }

        try {
            const url = new URL(value.trim());

            if (
                url.protocol !== "http:" &&
                url.protocol !== "https:"
            ) {
                return "Website must start with http:// or https://.";
            }

            if (!url.hostname.includes(".")) {
                return "Please enter a valid website URL.";
            }

            return "";
        } catch {
            return "Please enter a valid website URL.";
        }
    };

    const validateCompanyType = (value) => {
        if (!value) {
            return "Company type is required.";
        }

        return "";
    };

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                return validateName(value);
            case "email":
                return validateEmail(value);
            case "phone":
                return validatePhone(value);
            case "password":
                return validatePassword(value);
            case "confirmPassword":
                return validateConfirmPassword(value);
            case "companyName":
                return validateCompanyName(value);
            case "companyType":
                return validateCompanyType(value);
            case "designation":
                return validateDesignation(value);
            case "website":
                return validateWebsite(value);
            default:
                return "";
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
        setFieldErrors((previous) => ({
            ...previous,
            general: "",
        }));

        if (touched[name]) {
            setFieldErrors((previous) => ({
                ...previous,
                [name]: validateField(name, value),
            }));
        }

        if (name === "password" && touched.confirmPassword) {
            setFieldErrors((previous) => ({
                ...previous,
                confirmPassword:
                    value === formData.confirmPassword
                        ? ""
                        : formData.confirmPassword
                          ? "Passwords do not match."
                          : "Please confirm your password.",
            }));
        }
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;

        setTouched((previous) => ({
            ...previous,
            [name]: true,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: validateField(name, value),
        }));
    };

    const handleAccountTypeChange = (type) => {
        setAccountType(type);
        setTouched({});
        setFieldErrors({});
        setSuccess("");

        if (type === "candidate") {
            setFormData((previous) => ({
                ...previous,
                companyName: "",
                companyType: "",
                designation: "",
                website: "",
            }));
        }
    };

    const validateAllFields = () => {
        const errors = {};

        const fieldsToValidate = [
            "name",
            "email",
            "phone",
            "password",
            "confirmPassword",
        ];

        if (accountType === "recruiter") {
            fieldsToValidate.push(
                "companyName",
                "companyType",
                "designation",
                "website"
            );
        }

        fieldsToValidate.forEach((field) => {
            const error = validateField(field, formData[field]);

            if (error) {
                errors[field] = error;
            }
        });

        setTouched((previous) => {
            const updated = { ...previous };

            fieldsToValidate.forEach((field) => {
                updated[field] = true;
            });

            return updated;
        });

        setFieldErrors(errors);

        if (!termsAccepted) {
            setTermsTouched(true);
        }

        return Object.keys(errors).length === 0 && termsAccepted;
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setSuccess("");

        if (!validateAllFields()) {
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
                userData.companyName = formData.companyName.trim();
                userData.companyType = formData.companyType;

                if (formData.designation.trim()) {
                    userData.designation = formData.designation.trim();
                }

                if (formData.website.trim()) {
                    userData.website = formData.website.trim();
                }
            }

            const response = await registerUser(userData);
            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setSuccess("Registration successful! Redirecting...");

            if (
                user.role === "CANDIDATE" ||
                user.role === "RECRUITER"
            ) {
                navigate("/");
                return;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setFieldErrors({
                general: "Invalid account role received from the server.",
            });
        } catch (error) {
            console.error("Registration error:", error);

            const backendMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Registration failed. Please try again.";

            const lowerMessage = backendMessage.toLowerCase();

            if (
                lowerMessage.includes("email") &&
                (lowerMessage.includes("already") ||
                    lowerMessage.includes("registered") ||
                    lowerMessage.includes("exist") ||
                    lowerMessage.includes("duplicate"))
            ) {
                setTouched((previous) => ({
                    ...previous,
                    email: true,
                }));

                setFieldErrors((previous) => ({
                    ...previous,
                    email: backendMessage,
                }));
            } else if (
                lowerMessage.includes("phone") &&
                (lowerMessage.includes("already") ||
                    lowerMessage.includes("duplicate") ||
                    lowerMessage.includes("exist"))
            ) {
                setTouched((previous) => ({
                    ...previous,
                    phone: true,
                }));

                setFieldErrors((previous) => ({
                    ...previous,
                    phone: backendMessage,
                }));
            } else if (lowerMessage.includes("company")) {
                setTouched((previous) => ({
                    ...previous,
                    companyName: true,
                }));

                setFieldErrors((previous) => ({
                    ...previous,
                    companyName: backendMessage,
                }));
            } else {
                setFieldErrors((previous) => ({
                    ...previous,
                    general: backendMessage,
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (fieldName) => {
        const hasError = Boolean(
            touched[fieldName] && fieldErrors[fieldName]
        );

        return `h-11 w-full rounded-lg border py-2 text-sm outline-none transition placeholder:text-slate-400 ${
            hasError
                ? "border-red-500 bg-red-50 pr-3 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        }`;
    };

    const inputWithLeftIconClass = (fieldName) => {
        const hasError = Boolean(
            touched[fieldName] && fieldErrors[fieldName]
        );

        return `h-11 w-full rounded-lg border py-2 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 ${
            hasError
                ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        }`;
    };

    const selectClass = (fieldName) => {
        const hasError = Boolean(
            touched[fieldName] && fieldErrors[fieldName]
        );

        return `h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition ${
            hasError
                ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        }`;
    };

    const RequiredMark = () => (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
        </span>
    );

    const renderFieldError = (fieldName) => {
        if (!touched[fieldName] || !fieldErrors[fieldName]) {
            return null;
        }

        return (
            <p className="mt-1.5 text-xs font-medium text-red-600">
                {fieldErrors[fieldName]}
            </p>
        );
    };

    return (
        <div className="jobbridge-register min-h-screen bg-slate-50 font-sans text-slate-800">
            <style>{`
                @keyframes registerHeaderEnter {
                    from { opacity: 0; transform: translateY(-12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes registerCardEnter {
                    from { opacity: 0; transform: translateY(22px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes registerContentEnter {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes registerOrbFloat {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-10px, 10px); }
                }

                .jobbridge-register .register-header {
                    animation: registerHeaderEnter 0.5s ease-out both;
                }

                .jobbridge-register .register-card {
                    animation: registerCardEnter 0.6s ease-out both;
                }

                .jobbridge-register .register-content {
                    animation: registerContentEnter 0.45s ease-out both;
                }

                .jobbridge-register .register-delay-1 { animation-delay: 0.08s; }
                .jobbridge-register .register-delay-2 { animation-delay: 0.16s; }
                .jobbridge-register .register-delay-3 { animation-delay: 0.24s; }
                .jobbridge-register .register-delay-4 { animation-delay: 0.32s; }

                .jobbridge-register .register-logo-icon {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .jobbridge-register .register-logo:hover .register-logo-icon {
                    transform: rotate(-7deg) scale(1.06);
                    box-shadow: 0 0 0 5px rgb(99 102 241 / 12%);
                }

                .jobbridge-register .register-nav-link {
                    position: relative;
                    transition: color 0.2s ease, transform 0.2s ease;
                }

                .jobbridge-register .register-nav-link::after {
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

                .jobbridge-register .register-nav-link:hover::after {
                    transform: scaleX(1);
                }

                .jobbridge-register .register-nav-link:hover {
                    color: #4f46e5;
                    transform: translateY(-1px);
                }

                .jobbridge-register .register-account-card {
                    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
                }

                .jobbridge-register .register-account-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 24px rgb(15 23 42 / 7%);
                }

                .jobbridge-register .register-submit {
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                }

                .jobbridge-register .register-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgb(79 70 229 / 20%);
                }

                .jobbridge-register .register-orb {
                    animation: registerOrbFloat 8s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .jobbridge-register *,
                    .jobbridge-register *::before,
                    .jobbridge-register *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            {/* NAVBAR */}
            <header className="register-header sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-7 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="register-logo flex shrink-0 items-center gap-2"
                        aria-label="JobBridge home"
                    >
                        <div className="register-logo-icon flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                            Job<span className="text-indigo-600">Bridge</span>
                        </span>
                    </button>

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
                            onClick={() => navigate("/")}
                            className="group inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md sm:px-4"
                        >
                            <span>Home</span>
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative min-h-[calc(100vh-64px)] overflow-hidden px-4 py-7 sm:px-6 sm:py-9 lg:px-8 mt-0">
                <div className="register-orb pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="register-orb pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-5xl">
                    {!accountType ? (
                        <div className="register-card mx-auto max-w-3xl">
                            <div className="register-content mb-6 text-center">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                                    Join JobBridge
                                </p>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Create your account
                                </h1>
                                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                    Choose how you want to use JobBridge and get started.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => handleAccountTypeChange("candidate")}
                                    className="register-account-card register-content register-delay-1 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <User size={23} />
                                        </div>
                                        <ArrowRight size={19} className="text-slate-300 transition group-hover:translate-x-1" />
                                    </div>

                                    <h2 className="mt-5 text-lg font-bold text-slate-900">
                                        I'm a Candidate
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Looking for job opportunities and building my career.
                                    </p>

                                    <div className="mt-5 space-y-3">
                                        {candidateFields.map((item) => (
                                            <div key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                    <Check size={12} />
                                                </span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                        Continue as Candidate <ArrowRight size={15} />
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleAccountTypeChange("recruiter")}
                                    className="register-account-card register-content register-delay-2 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <Building2 size={23} />
                                        </div>
                                        <ArrowRight size={19} className="text-slate-300" />
                                    </div>

                                    <h2 className="mt-5 text-lg font-bold text-slate-900">
                                        I'm a Recruiter
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Hiring talent and finding skilled candidates.
                                    </p>

                                    <div className="mt-5 space-y-3">
                                        {recruiterFields.map((item) => (
                                            <div key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                    <Check size={12} />
                                                </span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                        Continue as Recruiter <ArrowRight size={15} />
                                    </div>
                                </button>
                            </div>

                            <p className="register-content register-delay-3 mt-6 text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <button type="button" onClick={() => navigate("/login")} className="font-semibold text-indigo-600 hover:text-indigo-700">
                                    Sign in
                                </button>
                            </p>
                        </div>
                    ) : (
                        <div className="register-card mx-auto max-w-4xl">
                            <button
                                type="button"
                                onClick={() => setAccountType(null)}
                                disabled={loading}
                                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600 disabled:opacity-50"
                            >
                                <ArrowLeft size={16} />
                                Change account type
                            </button>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                                <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
                                    {/* INFORMATION PANEL */}
                                    <aside className="relative overflow-hidden bg-indigo-600 p-6 text-white sm:p-8 lg:p-9">
                                        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

                                        <div className="relative">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                                                {accountType === "candidate" ? (
                                                    <User size={23} />
                                                ) : (
                                                    <Building2 size={23} />
                                                )}
                                            </div>

                                            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-indigo-100">
                                                {accountType === "candidate" ? "Candidate account" : "Recruiter account"}
                                            </p>

                                            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                                                {accountType === "candidate"
                                                    ? "Your next opportunity starts here."
                                                    : "Find the right people for your team."}
                                            </h1>

                                            <p className="mt-4 text-sm leading-6 text-indigo-100">
                                                {accountType === "candidate"
                                                    ? "Create your account and take the next step in your career with JobBridge."
                                                    : "Set up your recruiter account to manage hiring and connect with candidates."}
                                            </p>

                                            <div className="mt-8 border-t border-white/20 pt-6">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
                                                    Get started in three steps
                                                </p>
                                                <div className="mt-4 space-y-4">
                                                    {[
                                                        "Create your account",
                                                        "Complete your profile",
                                                        "Start using JobBridge",
                                                    ].map((item, index) => (
                                                        <div key={item} className="flex items-center gap-3 text-sm">
                                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xs font-semibold">
                                                                {index + 1}
                                                            </span>
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </aside>

                                    {/* REGISTRATION FORM */}
                                    <section className="p-5 sm:p-7 lg:p-8">
                                        <div className="register-content mb-6">
                                            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                                                Join JobBridge
                                            </p>
                                            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
                                                Create your account
                                            </h2>
                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                Fill in your details below. Fields marked with <span className="font-semibold text-red-500">*</span> are required.
                                            </p>
                                        </div>

                                        {success && (
                                            <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 text-sm font-medium text-green-700">
                                                {success}
                                            </div>
                                        )}

                                        {fieldErrors.general && (
                                            <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-600">
                                                {fieldErrors.general}
                                            </div>
                                        )}

                                        <form onSubmit={handleRegister} noValidate className="space-y-4">
                                            {/* FULL NAME + PHONE */}
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="register-content register-delay-1">
                                                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                        Full name<RequiredMark />
                                                    </label>
                                                    <div className="relative">
                                                        <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            id="name"
                                                            name="name"
                                                            required
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            maxLength={30}
                                                            autoComplete="name"
                                                            placeholder="Enter your full name"
                                                            className={`${inputWithLeftIconClass("name")} pl-10`}
                                                        />
                                                    </div>
                                                    {renderFieldError("name")}
                                                </div>

                                                <div className="register-content register-delay-1">
                                                    <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                        Phone number<RequiredMark />
                                                    </label>
                                                    <div className="relative">
                                                        <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            id="phone"
                                                            name="phone"
                                                            required
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={(event) => {
                                                                const value = event.target.value.replace(/\D/g, "").slice(0, 10);
                                                                handleChange({
                                                                    target: {
                                                                        name: "phone",
                                                                        value,
                                                                    },
                                                                });
                                                            }}
                                                            onBlur={handleBlur}
                                                            maxLength={10}
                                                            autoComplete="tel"
                                                            placeholder="10-digit phone number"
                                                            className={`${inputWithLeftIconClass("phone")} pl-10`}
                                                        />
                                                    </div>
                                                    {renderFieldError("phone")}
                                                </div>
                                            </div>

                                            {/* EMAIL */}
                                            <div className="register-content register-delay-1">
                                                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                    Email address<RequiredMark />
                                                </label>
                                                <div className="relative">
                                                    <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        autoComplete="email"
                                                        placeholder="you@example.com"
                                                        className={`${inputWithLeftIconClass("email")} pl-10`}
                                                    />
                                                </div>
                                                {renderFieldError("email")}
                                            </div>

                                            {/* RECRUITER FIELDS */}
                                            {accountType === "recruiter" && (
                                                <>
                                                    <div className="register-content register-delay-2">
                                                        <label htmlFor="companyName" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                            Company name<RequiredMark />
                                                        </label>
                                                        <div className="relative">
                                                            <Building2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <input
                                                                id="companyName"
                                                                name="companyName"
                                                                required
                                                                type="text"
                                                                value={formData.companyName}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={100}
                                                                placeholder="Enter company name"
                                                                className={`${inputWithLeftIconClass("companyName")} pl-10`}
                                                            />
                                                        </div>
                                                        {renderFieldError("companyName")}
                                                        <p className="mt-1 text-right text-xs text-slate-400">
                                                            {formData.companyName.length}/100
                                                        </p>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div className="register-content register-delay-2">
                                                            <label htmlFor="companyType" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                                Company type<RequiredMark />
                                                            </label>
                                                            <select
                                                                id="companyType"
                                                                name="companyType"
                                                                required
                                                                value={formData.companyType}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                className={selectClass("companyType")}
                                                            >
                                                                <option value="">Select company type</option>
                                                                <option value="DIRECT">Direct Company</option>
                                                                <option value="CONSULTANCY">Recruitment Consultancy</option>
                                                            </select>
                                                            {renderFieldError("companyType")}
                                                        </div>

                                                        <div className="register-content register-delay-2">
                                                            <label htmlFor="designation" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                                Designation <span className="font-normal text-slate-400">(Optional)</span>
                                                            </label>
                                                            <input
                                                                id="designation"
                                                                name="designation"
                                                                type="text"
                                                                value={formData.designation}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                maxLength={100}
                                                                placeholder="e.g. HR Manager"
                                                                className={`${inputClass("designation")} px-3`}
                                                            />
                                                            {renderFieldError("designation")}
                                                        </div>
                                                    </div>

                                                    <div className="register-content register-delay-2">
                                                        <label htmlFor="website" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                            Company website <span className="font-normal text-slate-400">(Optional)</span>
                                                        </label>
                                                        <input
                                                            id="website"
                                                            name="website"
                                                            type="url"
                                                            value={formData.website}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="https://example.com"
                                                            className={`${inputClass("website")} px-3`}
                                                        />
                                                        {renderFieldError("website")}
                                                        <p className="mt-1.5 text-xs leading-5 text-slate-400">
                                                            Choose Direct Company for your own organization or Recruitment Consultancy if you hire for client companies.
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* PASSWORDS */}
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="register-content register-delay-3">
                                                    <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                        Password<RequiredMark />
                                                    </label>
                                                    <div className="relative">
                                                        <LockKeyhole size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            required
                                                            type={showPassword ? "text" : "password"}
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            autoComplete="new-password"
                                                            placeholder="At least 8 characters"
                                                            className={`${inputWithLeftIconClass("password")} pl-10`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword((previous) => !previous)}
                                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                                                        >
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                    {renderFieldError("password")}
                                                </div>

                                                <div className="register-content register-delay-3">
                                                    <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                        Confirm password<RequiredMark />
                                                    </label>
                                                    <div className="relative">
                                                        <LockKeyhole size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            required
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={formData.confirmPassword}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            autoComplete="new-password"
                                                            placeholder="Re-enter password"
                                                            className={`${inputWithLeftIconClass("confirmPassword")} pl-10`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword((previous) => !previous)}
                                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                                                        >
                                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                    {renderFieldError("confirmPassword")}
                                                </div>
                                            </div>

                                            {/* TERMS */}
                                            <div className="register-content register-delay-3 pt-1">
                                                <label className="flex cursor-pointer items-start gap-2.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={termsAccepted}
                                                        onChange={(event) => {
                                                            setTermsAccepted(event.target.checked);
                                                            setTermsTouched(true);
                                                        }}
                                                        className={`mt-0.5 h-4 w-4 shrink-0 rounded text-indigo-600 focus:ring-indigo-500 ${
                                                            termsTouched && !termsAccepted
                                                                ? "border-red-500"
                                                                : "border-slate-300"
                                                        }`}
                                                    />
                                                    <span className="text-xs leading-5 text-slate-500">
                                                        I agree to the JobBridge{" "}
                                                        <button type="button" className="font-semibold text-indigo-600 hover:underline">
                                                            Terms of Service
                                                        </button>{" "}
                                                        and{" "}
                                                        <button type="button" className="font-semibold text-indigo-600 hover:underline">
                                                            Privacy Policy
                                                        </button>
                                                        <RequiredMark />.
                                                    </span>
                                                </label>
                                                {termsTouched && !termsAccepted && (
                                                    <p className="mt-1.5 text-xs font-medium text-red-600">
                                                        Please accept the Terms of Service and Privacy Policy.
                                                    </p>
                                                )}
                                            </div>

                                            {/* SUBMIT */}
                                            <div className="register-content register-delay-4 pt-1">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="register-submit flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                            Creating account...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Create {accountType === "candidate" ? "Candidate" : "Recruiter"} Account
                                                            <ArrowRight size={16} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>

                                        <div className="register-content register-delay-4 mt-5 border-t border-slate-100 pt-4 text-center">
                                            <p className="text-sm text-slate-500">
                                                Already have an account?{" "}
                                                <button
                                                    type="button"
                                                    onClick={() => navigate("/login")}
                                                    className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                                                >
                                                    Sign in
                                                </button>
                                            </p>
                                        </div>
                                    </section>
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