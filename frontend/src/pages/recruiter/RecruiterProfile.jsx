import {
    AlertCircle,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileText,
    Globe,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getMyCompany,
    getRecruiterProfile,
    updateMyCompany,
    updateRecruiterProfile,
} from "../../services/profileService";

const initialProfile = {
    name: "",
    email: "",
    phone: "",
    designation: "",
};

const initialCompany = {
    name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
};

const whitespaceError = (value) => {
    if (value !== value.trim()) {
        return "Leading or trailing spaces are not allowed.";
    }

    if (/ {2,}|\t{2,}/.test(value)) {
        return "Avoid using multiple spaces together.";
    }

    return "";
};
const validateField = (section, name, value) => {
    const fieldValue = String(value ?? "");
    const whitespace = whitespaceError(fieldValue);

    if (whitespace) return whitespace;

    if (name === "email") {
        if (
            fieldValue &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)
        ) {
            return "Enter a valid email address.";
        }

        return "";
    }

    if (name === "name" && section === "profile") {
        if (!fieldValue) return "Full name is required.";

        if (fieldValue.length < 2 || fieldValue.length > 80) {
            return "Name must contain 2–80 characters.";
        }

        if (
            !/^[\p{L}][\p{L}.'-]*(?: [\p{L}][\p{L}.'-]*)*$/u.test(
                fieldValue
            )
        ) {
            return "Use letters, spaces, apostrophes, periods or hyphens only.";
        }

        return "";
    }

    if (name === "phone") {
        if (!fieldValue) return "Phone number is required.";

        if (!/^(?:(?:\+91|91))?[6-9]\d{9}$/.test(fieldValue)) {
            return "Enter a valid Indian mobile number, e.g. 9876543210 or +919876543210.";
        }

        return "";
    }

    if (name === "designation") {
        if (!fieldValue) return "Designation is required.";

        if (fieldValue.length < 2 || fieldValue.length > 100) {
            return "Designation must contain 2–100 characters.";
        }

        if (
            !/^[\p{L}\p{N}][\p{L}\p{N} .,&()/'-]*$/u.test(
                fieldValue
            )
        ) {
            return "Enter a valid designation.";
        }

        return "";
    }

    if (name === "name" && section === "company") {
        if (!fieldValue) return "Company name is required.";

        if (fieldValue.length < 2 || fieldValue.length > 150) {
            return "Company name must contain 2–150 characters.";
        }

        if (
            !/^[\p{L}\p{N}][\p{L}\p{N} .,&()'/-]*$/u.test(
                fieldValue
            )
        ) {
            return "Enter a valid company name.";
        }

        return "";
    }

    if (name === "description") {
        if (!fieldValue) return "Company description is required.";

        if (fieldValue.length < 10) {
            return "Description must contain at least 10 characters.";
        }

        if (fieldValue.length > 2000) {
            return "Description cannot exceed 2000 characters.";
        }

        if (/[ \t]+\n|\n[ \t]+/.test(fieldValue)) {
            return "Remove unnecessary spaces around line breaks.";
        }

        if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(fieldValue)) {
            return "Description contains invalid characters.";
        }

        return "";
    }

    if (name === "website" || name === "logo") {
        if (!fieldValue) return "";

        try {
            const url = new URL(fieldValue);

            if (
                !["http:", "https:"].includes(url.protocol) ||
                !url.hostname.includes(".") ||
                url.hostname.startsWith(".") ||
                url.hostname.endsWith(".")
            ) {
                return "Enter a valid website URL starting with https://.";
            }

            return "";
        } catch {
            return "Enter a valid URL starting with https://.";
        }
    }

    if (name === "location") {
        if (!fieldValue) return "Company location is required.";

        if (fieldValue.length < 2 || fieldValue.length > 150) {
            return "Location must contain 2–150 characters.";
        }

        if (
            !/^[\p{L}\p{N}][\p{L}\p{N} ,.'()/-]*$/u.test(
                fieldValue
            )
        ) {
            return "Enter a valid location, e.g. Delhi, India.";
        }

        return "";
    }

    return "";
};

const RecruiterProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [profile, setProfile] = useState(initialProfile);
    const [company, setCompany] = useState(initialCompany);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const [recruiterResponse, companyResponse] =
                await Promise.all([
                    getRecruiterProfile(),
                    getMyCompany(),
                ]);

            const recruiter = recruiterResponse.data.recruiter;
            const companyData = companyResponse.data.company;

            setProfile({
                name: recruiter.user?.name || "",
                email: recruiter.user?.email || "",
                phone:
                    recruiter.user?.phone ||
                    recruiter.phone ||
                    "",
                designation: recruiter.designation || "",
            });

            setCompany({
                name: companyData.name || "",
                description: companyData.description || "",
                website: companyData.website || "",
                location: companyData.location || "",
                logo: companyData.logo || "",
            });
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to load recruiter profile. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (section, e) => {
        const { name, value } = e.target;

        if (section === "profile") {
            setProfile((previous) => ({
                ...previous,
                [name]: value,
            }));
        } else {
            setCompany((previous) => ({
                ...previous,
                [name]: value,
            }));
        }

        const key = `${section}.${name}`;

        if (Object.prototype.hasOwnProperty.call(fieldErrors, key)) {
            setFieldErrors((previous) => ({
                ...previous,
                [key]: validateField(section, name, value),
            }));
        }

        setMessage("");
        setError("");
    };

    const handleFieldBlur = (section, e) => {
        const { name, value } = e.target;
        const key = `${section}.${name}`;

        setFieldErrors((previous) => ({
            ...previous,
            [key]: validateField(section, name, value),
        }));
    };

    const validateAllFields = () => {
        const values = {
            "profile.name": validateField("profile", "name", profile.name),
            "profile.email": validateField("profile", "email", profile.email),
            "profile.phone": validateField("profile", "phone", profile.phone),
            "profile.designation": validateField(
                "profile",
                "designation",
                profile.designation
            ),
            "company.name": validateField("company", "name", company.name),
            "company.description": validateField(
                "company",
                "description",
                company.description
            ),
            "company.website": validateField(
                "company",
                "website",
                company.website
            ),
            "company.location": validateField(
                "company",
                "location",
                company.location
            ),
            "company.logo": validateField("company", "logo", company.logo),
        };

        setFieldErrors(values);
        return Object.values(values).every((value) => !value);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!validateAllFields()) {
            const message = "Please correct the highlighted fields before saving.";
            setError(message);
            toast.error(message);
            return;
        }

        try {
            setSaving(true);

            await updateRecruiterProfile({
                name: profile.name,
                phone: profile.phone,
                designation: profile.designation,
            });

            await updateMyCompany({
                name: company.name,
                description: company.description,
                website: company.website,
                location: company.location,
                logo: company.logo,
            });

            setMessage("Profile updated successfully.");
            setFieldErrors({});
            toast.success("Profile updated successfully.");
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to update profile. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] w-full items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <Loader2
                        size={22}
                        className="animate-spin text-indigo-600"
                    />
                    <p className="text-sm font-medium text-slate-600">
                        Loading recruiter profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="-mx-5 -my-6 min-h-[calc(100vh-4rem)] w-auto bg-slate-50 sm:-mx-7 lg:-mx-10">
            <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
                {/* Compact page heading */}
                <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Recruiter Profile
                            </h1>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Manage your details and company information.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 sm:self-auto">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-indigo-700">
                            Recruiter Account
                        </span>
                    </div>
                </div>

                {message && (
                    <div
                        role="status"
                        className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
                    >
                        <CheckCircle2 size={18} className="shrink-0" />
                        <p>{message}</p>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                    >
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSave} noValidate>
                    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                        {/* Recruiter details */}
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center gap-3 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-white px-4 py-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                                    <UserRound size={19} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Personal Information
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Your contact and professional details
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-x-4 gap-y-3 p-4 md:grid-cols-2">
                                <InputField
                                    label="Full Name"
                                    name="name"
                                    value={profile.name}
                                    onChange={(e) =>
                                        handleFieldChange("profile", e)
                                    }
                                    onBlur={(e) =>
                                        handleFieldBlur("profile", e)
                                    }
                                    error={fieldErrors["profile.name"]}
                                    icon={<UserRound size={16} />}
                                    placeholder="Enter your full name"
                                    required
                                    maxLength={80}
                                    autoComplete="name"
                                />

                                <InputField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={() => { }}
                                    onBlur={(e) =>
                                        handleFieldBlur("profile", e)
                                    }
                                    error={fieldErrors["profile.email"]}
                                    icon={<Mail size={16} />}
                                    disabled
                                    required
                                    autoComplete="email"
                                    hint="Read-only account email"
                                />

                                <InputField
                                    label="Mobile Number"
                                    name="phone"
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) =>
                                        handleFieldChange("profile", e)
                                    }
                                    onBlur={(e) =>
                                        handleFieldBlur("profile", e)
                                    }
                                    error={fieldErrors["profile.phone"]}
                                    icon={<Phone size={16} />}
                                    placeholder="9876543210"
                                    required
                                    maxLength={13}
                                    autoComplete="tel"
                                />

                                <InputField
                                    label="Designation"
                                    name="designation"
                                    value={profile.designation}
                                    onChange={(e) =>
                                        handleFieldChange("profile", e)
                                    }
                                    onBlur={(e) =>
                                        handleFieldBlur("profile", e)
                                    }
                                    error={fieldErrors["profile.designation"]}
                                    icon={<BriefcaseBusiness size={16} />}
                                    placeholder="e.g. HR Manager"
                                    required
                                    maxLength={100}
                                />

                                <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 md:col-span-2">
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5 text-indigo-600">
                                            <CheckCircle2 size={17} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-indigo-900">
                                                Account information
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-indigo-800/80">
                                                Your email is linked to your account and cannot be edited here. Update your contact details when they change.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Company details */}
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center gap-3 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-white px-4 py-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                                    <Building2 size={19} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Company Information
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Details visible to job candidates
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 p-4">
                                <InputField
                                    label="Company Name"
                                    name="name"
                                    value={company.name}
                                    onChange={(e) =>
                                        handleFieldChange("company", e)
                                    }
                                    onBlur={(e) =>
                                        handleFieldBlur("company", e)
                                    }
                                    error={fieldErrors["company.name"]}
                                    icon={<Building2 size={16} />}
                                    placeholder="Enter company name"
                                    required
                                    maxLength={150}
                                />

                                <TextareaField
                                    label="Company Description"
                                    name="description"
                                    value={company.description}
                                    onChange={(e) =>
                                        handleFieldChange("company", e)
                                    }
                                    onBlur={(e) =>
                                        handleFieldBlur("company", e)
                                    }
                                    error={fieldErrors["company.description"]}
                                    placeholder="Describe your company, its work, and its culture..."
                                    rows={3}
                                    maxLength={2000}
                                    required
                                />

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <InputField
                                        label="Company Website"
                                        name="website"
                                        type="url"
                                        value={company.website}
                                        onChange={(e) =>
                                            handleFieldChange("company", e)
                                        }
                                        onBlur={(e) =>
                                            handleFieldBlur("company", e)
                                        }
                                        error={fieldErrors["company.website"]}
                                        icon={<Globe size={16} />}
                                        placeholder="https://example.com"
                                        maxLength={2048}
                                        hint="Optional"
                                    />

                                    <InputField
                                        label="Company Location"
                                        name="location"
                                        value={company.location}
                                        onChange={(e) =>
                                            handleFieldChange("company", e)
                                        }
                                        onBlur={(e) =>
                                            handleFieldBlur("company", e)
                                        }
                                        error={fieldErrors["company.location"]}
                                        icon={<MapPin size={16} />}
                                        placeholder="Delhi, India"
                                        required
                                        maxLength={150}
                                    />
                                </div>

                                <InputField
                                    label="Company Logo URL"
                                    name="logo"
                                    type="url"
                                    value={company.logo}
                                    onChange={(e) =>
                                        handleFieldChange("company", e)
                                    }
                                    onBlur={(e) =>
                                        handleFieldBlur("company", e)
                                    }
                                    error={fieldErrors["company.logo"]}
                                    icon={<FileText size={16} />}
                                    placeholder="https://example.com/logo.png"
                                    maxLength={2048}
                                    hint="Optional — use a publicly accessible image URL."
                                />

                                {company.logo &&
                                    !fieldErrors["company.logo"] && (
                                        <div className="flex items-center gap-3 rounded-lg border border-violet-100 bg-violet-50/60 p-3">
                                            <img
                                                src={company.logo}
                                                alt="Company logo preview"
                                                className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-800">
                                                    Company logo preview
                                                </p>
                                                <p className="mt-1 break-all text-xs text-slate-500">
                                                    Confirm that the image URL is publicly accessible.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </section>
                    </div>

                    {/* Compact save footer */}
                    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CheckCircle2
                                size={16}
                                className="shrink-0 text-emerald-600"
                            />
                            Your personal and company details are saved together.
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <Save size={17} />
                            )}

                            {saving ? "Saving changes..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    icon,
    disabled = false,
    placeholder = "",
    error = "",
    required = false,
    maxLength,
    autoComplete,
    hint,
}) => {
    const invalid = Boolean(error);
    const errorId = `${name}-error`;
    const hintId = `${name}-hint`;

    return (
        <div className="min-w-0">
            <label
                htmlFor={name}
                className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
                {label}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <div className="relative">
                <div
                    className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${invalid ? "text-red-500" : "text-slate-400"
                        }`}
                >
                    {icon}
                </div>

                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    aria-invalid={invalid}
                    aria-describedby={
                        [
                            invalid ? errorId : "",
                            hint ? hintId : "",
                        ]
                            .filter(Boolean)
                            .join(" ") || undefined
                    }
                    className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 ${invalid
                        ? "border-red-500 ring-1 ring-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        } ${disabled
                            ? "cursor-not-allowed bg-slate-100 text-slate-500"
                            : ""
                        }`}
                />
            </div>

            {invalid && (
                <p
                    id={errorId}
                    className="mt-1.5 flex items-start gap-1 text-xs leading-4 text-red-600"
                >
                    <AlertCircle
                        size={13}
                        className="mt-0.5 shrink-0"
                    />
                    <span>{error}</span>
                </p>
            )}

            {!invalid && hint && (
                <p
                    id={hintId}
                    className="mt-1 text-[11px] leading-4 text-slate-500"
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

const TextareaField = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    rows = 3,
    maxLength,
    error = "",
    required = false,
}) => {
    const invalid = Boolean(error);
    const errorId = `${name}-error`;

    return (
        <div className="min-w-0">
            <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                    htmlFor={name}
                    className="block text-xs font-semibold text-slate-700"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>

                <span className="shrink-0 text-[11px] text-slate-400">
                    {value.length}/{maxLength}
                </span>
            </div>

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                aria-invalid={invalid}
                aria-describedby={invalid ? errorId : undefined}
                className={`w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 ${invalid
                    ? "border-red-500 ring-1 ring-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`}
            />

            {invalid && (
                <p
                    id={errorId}
                    className="mt-1.5 flex items-start gap-1 text-xs leading-4 text-red-600"
                >
                    <AlertCircle
                        size={13}
                        className="mt-0.5 shrink-0"
                    />
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
};

export default RecruiterProfile;