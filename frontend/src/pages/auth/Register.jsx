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

        // Recruiter
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

    /*
     * Allows only:
     * - letters
     * - numbers
     * - common name characters
     * - exactly one space between words
     */
    const hasInvalidSpaces = (value) => {
        return (
            /^\s/.test(value) ||
            /\s$/.test(value) ||
            /\s{2,}/.test(value)
        );
    };

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

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(value.trim())) {
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

        /*
         * Validate immediately after the user has
         * interacted with the field.
         */
        if (touched[name]) {
            const error = validateField(name, value);

            setFieldErrors((previous) => ({
                ...previous,
                [name]: error,
            }));
        }

        /*
         * Password affects confirm password.
         */
        if (
            name === "password" &&
            touched.confirmPassword
        ) {
            setFieldErrors((previous) => ({
                ...previous,
                confirmPassword: validateConfirmPassword(
                    formData.confirmPassword
                ),
            }));
        }
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;

        setTouched((previous) => ({
            ...previous,
            [name]: true,
        }));

        const error = validateField(name, value);

        setFieldErrors((previous) => ({
            ...previous,
            [name]: error,
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
            const error = validateField(
                field,
                formData[field]
            );

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

        return (
            Object.keys(errors).length === 0 &&
            termsAccepted
        );
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        setSuccess("");

        const isValid = validateAllFields();

        if (!isValid) {
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

            /*
             * Candidate registration only creates
             * the account.
             *
             * Professional information will be
             * completed later from the profile.
             */
            if (accountType === "recruiter") {
                userData.companyName =
                    formData.companyName.trim();

                userData.companyType =
                    formData.companyType;

                if (formData.designation.trim()) {
                    userData.designation =
                        formData.designation.trim();
                }

                if (formData.website.trim()) {
                    userData.website =
                        formData.website.trim();
                }
            }

            const response = await registerUser(userData);

            const { token, user } = response.data;

            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            setSuccess(
                "Registration successful! Redirecting..."
            );

            if (user.role === "CANDIDATE") {
                navigate("/");
                return;
            }

            if (user.role === "RECRUITER") {
                navigate("/");
                return;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setFieldErrors({
                email: "Invalid account role received from the server.",
            });
        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            /*
             * Try to identify backend validation errors
             * and show them below the relevant field.
             */
            const backendMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Registration failed. Please try again.";

            const lowerMessage =
                backendMessage.toLowerCase();

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
            } else if (
                lowerMessage.includes("company")
            ) {
                setTouched((previous) => ({
                    ...previous,
                    companyName: true,
                }));

                setFieldErrors((previous) => ({
                    ...previous,
                    companyName: backendMessage,
                }));
            } else {
                /*
                 * If the backend returns an error that
                 * cannot be associated with a particular
                 * field, show it at the top.
                 */
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
            touched[fieldName] &&
                fieldErrors[fieldName]
        );

        return `h-10 w-full rounded-lg border py-2 text-sm outline-none transition placeholder:text-slate-400 ${
            hasError
                ? "border-red-500 bg-red-50 pr-3 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        }`;
    };

    const inputWithLeftIconClass = (fieldName) => {
        const hasError = Boolean(
            touched[fieldName] &&
                fieldErrors[fieldName]
        );

        return `h-10 w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 ${
            hasError
                ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        }`;
    };

    const selectClass = (fieldName) => {
        const hasError = Boolean(
            touched[fieldName] &&
                fieldErrors[fieldName]
        );

        return `h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition ${
            hasError
                ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        }`;
    };

    const renderFieldError = (fieldName) => {
        if (
            !touched[fieldName] ||
            !fieldErrors[fieldName]
        ) {
            return null;
        }

        return (
            <p className="mt-1.5 text-xs font-medium text-red-600">
                {fieldErrors[fieldName]}
            </p>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Job
                            <span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={16} />

                        <span className="hidden sm:inline">
                            Back to Home
                        </span>
                    </button>
                </div>
            </header>

            <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* Account Type Selection */}
                    {!accountType ? (
                        <div className="mx-auto max-w-3xl">
                            <div className="mb-6 text-center">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                    Join JobBridge
                                </p>

                                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Create your account
                                </h1>

                                <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                                    Choose how you want to use
                                    JobBridge.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Candidate */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAccountTypeChange(
                                            "candidate"
                                        )
                                    }
                                    className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                            <User size={22} />
                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                        />
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                                        I'm a Candidate
                                    </h2>

                                    <p className="mt-1.5 text-sm leading-5 text-slate-500">
                                        Looking for job opportunities
                                        and building my career.
                                    </p>

                                    <div className="mt-4 space-y-2">
                                        {candidateFields.map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center gap-2 text-xs text-slate-600"
                                                >
                                                    <Check
                                                        size={14}
                                                        className="shrink-0 text-indigo-600"
                                                    />

                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-5 text-sm font-semibold text-indigo-600">
                                        Continue as Candidate →
                                    </div>
                                </button>

                                {/* Recruiter */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAccountTypeChange(
                                            "recruiter"
                                        )
                                    }
                                    className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                            <Building2 size={22} />
                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                        />
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                                        I'm a Recruiter
                                    </h2>

                                    <p className="mt-1.5 text-sm leading-5 text-slate-500">
                                        Hiring talent and finding
                                        skilled candidates.
                                    </p>

                                    <div className="mt-4 space-y-2">
                                        {recruiterFields.map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center gap-2 text-xs text-slate-600"
                                                >
                                                    <Check
                                                        size={14}
                                                        className="shrink-0 text-indigo-600"
                                                    />

                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-5 text-sm font-semibold text-indigo-600">
                                        Continue as Recruiter →
                                    </div>
                                </button>
                            </div>

                            <p className="mt-5 text-center text-sm text-slate-500">
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
                            {/* Change account type */}
                            <button
                                type="button"
                                onClick={() =>
                                    setAccountType(null)
                                }
                                disabled={loading}
                                className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ArrowLeft size={16} />
                                Change account type
                            </button>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
                                    {/* Left information panel */}
                                    <div className="bg-indigo-600 p-6 text-white sm:p-8">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
                                            {accountType ===
                                            "candidate" ? (
                                                <User size={22} />
                                            ) : (
                                                <Building2 size={22} />
                                            )}
                                        </div>

                                        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-indigo-100">
                                            {accountType ===
                                            "candidate"
                                                ? "Candidate Account"
                                                : "Recruiter Account"}
                                        </p>

                                        <h1 className="mt-1.5 text-2xl font-bold leading-tight sm:text-3xl">
                                            {accountType ===
                                            "candidate"
                                                ? "Start your career journey."
                                                : "Build your hiring team."}
                                        </h1>

                                        <p className="mt-3 text-sm leading-5 text-indigo-100">
                                            {accountType ===
                                            "candidate"
                                                ? "Create your account and complete your professional profile after registration."
                                                : "Create your recruiter account and start connecting with qualified candidates."}
                                        </p>

                                        <div className="mt-6 hidden border-t border-white/15 pt-5 sm:block">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">
                                                Quick and simple
                                            </p>

                                            <div className="mt-3 space-y-2.5">
                                                <div className="flex items-center gap-2 text-sm text-white">
                                                    <Check
                                                        size={15}
                                                    />
                                                    Create your account
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-white">
                                                    <Check
                                                        size={15}
                                                    />
                                                    Complete your profile
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-white">
                                                    <Check
                                                        size={15}
                                                    />
                                                    Start using JobBridge
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="p-5 sm:p-7">
                                        <div className="mb-5">
                                            <h2 className="text-xl font-bold text-slate-900">
                                                Create your{" "}
                                                {accountType ===
                                                "candidate"
                                                    ? "candidate"
                                                    : "recruiter"}{" "}
                                                account
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Enter your details below
                                                to get started.
                                            </p>
                                        </div>

                                        {/* General backend error */}
                                        {fieldErrors.general && (
                                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
                                                {fieldErrors.general}
                                            </div>
                                        )}

                                        <form
                                            onSubmit={
                                                handleRegister
                                            }
                                            noValidate
                                            className="space-y-4"
                                        >
                                            {/* Name + Phone */}
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {/* Full Name */}
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                        Full name
                                                    </label>

                                                    <div className="relative">
                                                        <User
                                                            size={17}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                        />

                                                        <input
                                                            name="name"
                                                            required
                                                            type="text"
                                                            value={
                                                                formData.name
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={
                                                                handleBlur
                                                            }
                                                            maxLength={
                                                                30
                                                            }
                                                            placeholder="Enter your name"
                                                            className={inputWithLeftIconClass(
                                                                "name"
                                                            )}
                                                        />
                                                    </div>

                                                    {renderFieldError(
                                                        "name"
                                                    )}
                                                </div>

                                                {/* Phone */}
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                        Phone number
                                                    </label>

                                                    <div className="relative">
                                                        <Phone
                                                            size={17}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                        />

                                                        <input
                                                            name="phone"
                                                            required
                                                            type="tel"
                                                            value={
                                                                formData.phone
                                                            }
                                                            onChange={
                                                                (event) => {
                                                                    const value =
                                                                        event
                                                                            .target
                                                                            .value
                                                                            .replace(
                                                                                /\D/g,
                                                                                ""
                                                                            )
                                                                            .slice(
                                                                                0,
                                                                                10
                                                                            );

                                                                    handleChange(
                                                                        {
                                                                            target: {
                                                                                name: "phone",
                                                                                value,
                                                                            },
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                            onBlur={
                                                                handleBlur
                                                            }
                                                            maxLength={
                                                                10
                                                            }
                                                            placeholder="10-digit phone number"
                                                            className={inputWithLeftIconClass(
                                                                "phone"
                                                            )}
                                                        />
                                                    </div>

                                                    {renderFieldError(
                                                        "phone"
                                                    )}
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                    Email address
                                                </label>

                                                <div className="relative">
                                                    <Mail
                                                        size={17}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />

                                                    <input
                                                        name="email"
                                                        required
                                                        type="email"
                                                        value={
                                                            formData.email
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        onBlur={
                                                            handleBlur
                                                        }
                                                        placeholder="Enter your email"
                                                        className={inputWithLeftIconClass(
                                                            "email"
                                                        )}
                                                    />
                                                </div>

                                                {renderFieldError(
                                                    "email"
                                                )}
                                            </div>

                                            {/* Recruiter Fields */}
                                            {accountType ===
                                                "recruiter" && (
                                                <>
                                                    {/* Company Name */}
                                                    <div>
                                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                            Company name
                                                        </label>

                                                        <div className="relative">
                                                            <Building2
                                                                size={17}
                                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                            />

                                                            <input
                                                                name="companyName"
                                                            required
                                                                type="text"
                                                                value={
                                                                    formData.companyName
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                maxLength={
                                                                    100
                                                                }
                                                                placeholder="Enter company name"
                                                                className={inputWithLeftIconClass(
                                                                    "companyName"
                                                                )}
                                                            />
                                                        </div>

                                                        {renderFieldError(
                                                            "companyName"
                                                        )}

                                                        <p className="mt-1 text-right text-xs text-slate-400">
                                                            {
                                                                formData
                                                                    .companyName
                                                                    .length
                                                            }
                                                            /100
                                                        </p>
                                                    </div>

                                                    {/* Company Type + Designation */}
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        {/* Company Type */}
                                                        <div>
                                                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                                Company type
                                                            </label>

                                                            <select
                                                                name="companyType"
                                                            required
                                                                value={
                                                                    formData.companyType
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                className={selectClass(
                                                                    "companyType"
                                                                )}
                                                            >
                                                                <option value="">
                                                                    Select type
                                                                </option>

                                                                <option value="DIRECT">
                                                                    Direct Company
                                                                </option>

                                                                <option value="CONSULTANCY">
                                                                    Recruitment Consultancy
                                                                </option>
                                                            </select>

                                                            {renderFieldError(
                                                                "companyType"
                                                            )}
                                                        </div>

                                                        {/* Designation */}
                                                        <div>
                                                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                maxLength={
                                                                    100
                                                                }
                                                                placeholder="e.g. HR Manager"
                                                                className={inputClass(
                                                                    "designation"
                                                                )}
                                                            />

                                                            {renderFieldError(
                                                                "designation"
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Website */}
                                                    <div>
                                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
                                                            onBlur={
                                                                handleBlur
                                                            }
                                                            placeholder="https://example.com"
                                                            className={inputClass(
                                                                "website"
                                                            )}
                                                        />

                                                        {renderFieldError(
                                                            "website"
                                                        )}

                                                        <p className="mt-1.5 text-xs text-slate-400">
                                                            Use Direct Company
                                                            for your own
                                                            organization and
                                                            Recruitment
                                                            Consultancy for
                                                            client hiring.
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Password + Confirm Password */}
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {/* Password */}
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                        Password
                                                    </label>

                                                    <div className="relative">
                                                        <LockKeyhole
                                                            size={17}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                        />

                                                        <input
                                                            name="password"
                                                            required
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
                                                            onBlur={
                                                                handleBlur
                                                            }
                                                            placeholder="Minimum 8 characters"
                                                            className={inputWithLeftIconClass(
                                                                "password"
                                                            )}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    (
                                                                        previous
                                                                    ) =>
                                                                        !previous
                                                                )
                                                            }
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                            aria-label={
                                                                showPassword
                                                                    ? "Hide password"
                                                                    : "Show password"
                                                            }
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {renderFieldError(
                                                        "password"
                                                    )}
                                                </div>

                                                {/* Confirm Password */}
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                        Confirm password
                                                    </label>

                                                    <div className="relative">
                                                        <LockKeyhole
                                                            size={17}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                        />

                                                        <input
                                                            name="confirmPassword"
                                                            required
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
                                                            onBlur={
                                                                handleBlur
                                                            }
                                                            placeholder="Re-enter password"
                                                            className={inputWithLeftIconClass(
                                                                "confirmPassword"
                                                            )}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowConfirmPassword(
                                                                    (
                                                                        previous
                                                                    ) =>
                                                                        !previous
                                                                )
                                                            }
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                            aria-label={
                                                                showConfirmPassword
                                                                    ? "Hide confirm password"
                                                                    : "Show confirm password"
                                                            }
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {renderFieldError(
                                                        "confirmPassword"
                                                    )}
                                                </div>
                                            </div>

                                            {/* Terms */}
                                            <div>
                                                <label className="flex cursor-pointer items-start gap-2 pt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            termsAccepted
                                                        }
                                                        onChange={(
                                                            event
                                                        ) => {
                                                            setTermsAccepted(
                                                                event
                                                                    .target
                                                                    .checked
                                                            );

                                                            setTermsTouched(
                                                                true
                                                            );
                                                        }}
                                                        className={`mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 ${
                                                            termsTouched &&
                                                            !termsAccepted
                                                                ? "border-red-500"
                                                                : "border-slate-300"
                                                        }`}
                                                    />

                                                    <span className="text-xs leading-5 text-slate-500">
                                                        I agree to the
                                                        JobBridge{" "}
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

                                                {termsTouched &&
                                                    !termsAccepted && (
                                                        <p className="mt-1.5 text-xs font-medium text-red-600">
                                                            Please accept
                                                            the Terms of
                                                            Service and
                                                            Privacy Policy.
                                                        </p>
                                                    )}
                                            </div>

                                            {/* Submit */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                                                        size={16}
                                                    />
                                                )}
                                            </button>
                                        </form>

                                        <p className="mt-4 text-center text-sm text-slate-500">
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
