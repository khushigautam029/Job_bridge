
import {
    Bell,
    Check,
    CheckCircle2,
    ChevronRight,
    Eye,
    EyeOff,
    LoaderCircle,
    Lock,
    Mail,
    Save,
    Settings,
    Shield,
    Sparkles,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    changePassword,
    getCurrentUser,
    getUserPreferences,
    saveUserPreferences,
    updateCurrentUser,
} from "../../services/userService";

const PRIMARY = "#4f46e5";

const sections = [
    {
        id: "account",
        label: "Account",
        description: "Contact information",
        icon: User,
    },
    {
        id: "notifications",
        label: "Notifications",
        description: "Recruitment alerts",
        icon: Bell,
    },
    {
        id: "password",
        label: "Password & Security",
        description: "Protect your account",
        icon: Lock,
    },
];

const sectionContent = {
    account: {
        title: "Recruiter account settings",
        description: "Manage your recruiter contact information.",
    },
    notifications: {
        title: "Notification preferences",
        description: "Choose how and when JobBridge keeps you informed.",
    },
    password: {
        title: "Password & security",
        description: "Keep your recruiter account protected.",
    },
};

// Validation helpers
const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required.";

    if (!/^[0-9]{10}$/.test(phone.trim())) {
        return "Please enter a valid 10-digit phone number.";
    }

    return "";
};

const validatePassword = (password) => {
    if (!password) return "Current password is required.";
    return "";
};

const validateNewPassword = (password) => {
    if (!password) return "New password is required.";

    if (password.length < 8) {
        return "Password must contain at least 8 characters.";
    }

    return "";
};

const validateConfirmPassword = (password, newPassword) => {
    if (!password) return "Please confirm your new password.";

    if (password !== newPassword) {
        return "Passwords do not match.";
    }

    return "";
};

// Reusable required label
const FieldLabel = ({ htmlFor, children, required = false }) => (
    <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-slate-700"
    >
        {children}

        {required && (
            <span className="ml-1 text-red-600" aria-hidden="true">
                *
            </span>
        )}
    </label>
);

// Reusable inline error
const FieldError = ({ children }) => {
    if (!children) return null;

    return (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600">
            <Shield size={13} className="mt-0.5 shrink-0" />
            <span>{children}</span>
        </p>
    );
};

const RecruiterSetting = () => {
    const [activeSection, setActiveSection] = useState("account");

    const [accountSettings, setAccountSettings] = useState({
        email: "",
        phone: "",
    });

    const [notificationSettings, setNotificationSettings] = useState({
        applicationAlerts: true,
        interviewUpdates: true,
        newCandidateAlerts: true,
        emailNotifications: true,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState("");
    const [savedSection, setSavedSection] = useState("");

    useEffect(() => {
        let active = true;

        Promise.all([getCurrentUser(), getUserPreferences()])
            .then(([{ user }, preferences]) => {
                if (!active) return;

                setAccountSettings({
                    email: user.email || "",
                    phone: user.phone || "",
                });

                setNotificationSettings((prev) => ({
                    ...prev,
                    ...(preferences.notificationSettings || {}),
                }));
            })
            .catch((loadError) => {
                if (active) {
                    setError(
                        loadError.response?.data?.message ||
                            "Unable to load recruiter settings."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const clearFieldError = (name) => {
        setFieldErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setError("");
        setMessage("");
        setSavedSection("");
        setFieldErrors({});
    };

    const handleAccountChange = (e) => {
        const { name, value } = e.target;

        setAccountSettings((prev) => ({
            ...prev,
            [name]: value,
        }));

        clearFieldError(name);
        setSavedSection("");
        setMessage("");
        setError("");

        // Validate while typing once an error has been displayed
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: name === "phone" ? validatePhone(value) : "",
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...passwordData,
            [name]: value,
        };

        setPasswordData(updatedData);

        setSavedSection("");
        setMessage("");
        setError("");

        setFieldErrors((prev) => {
            const updatedErrors = { ...prev };

            if (name === "currentPassword" && prev.currentPassword) {
                updatedErrors.currentPassword = validatePassword(value);
            }

            if (name === "newPassword" && prev.newPassword) {
                updatedErrors.newPassword = validateNewPassword(value);
            }

            if (name === "confirmPassword" && prev.confirmPassword) {
                updatedErrors.confirmPassword = validateConfirmPassword(
                    value,
                    updatedData.newPassword
                );
            }

            // Revalidate confirm password when new password changes
            if (
                name === "newPassword" &&
                updatedErrors.confirmPassword
            ) {
                updatedErrors.confirmPassword = validateConfirmPassword(
                    updatedData.confirmPassword,
                    updatedData.newPassword
                );
            }

            return updatedErrors;
        });
    };

    const handleNotificationChange = (name) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));

        setSavedSection("");
        setMessage("");
        setError("");
    };

    const runSave = async (section, action, successText) => {
        setSaving(section);
        setSavedSection("");
        setError("");
        setMessage("");

        try {
            await action();
            setSavedSection(section);
            setMessage(successText);
        } catch (saveError) {
            setError(
                saveError.response?.data?.message ||
                    "Unable to save your changes. Please try again."
            );
        } finally {
            setSaving("");
        }
    };

    // Account validation
    const validateAccountForm = () => {
        const errors = {
            phone: validatePhone(accountSettings.phone),
        };

        setFieldErrors(errors);

        return !Object.values(errors).some(Boolean);
    };

    const handleAccountSave = async (e) => {
        e.preventDefault();

        if (!validateAccountForm()) {
            setMessage("");
            setError("Please correct the highlighted field.");
            return;
        }

        await runSave(
            "account",
            () => updateCurrentUser({ phone: accountSettings.phone }),
            "Recruiter account settings saved successfully."
        );
    };

    // Password validation
    const validatePasswordForm = () => {
        const errors = {
            currentPassword: validatePassword(
                passwordData.currentPassword
            ),
            newPassword: validateNewPassword(
                passwordData.newPassword
            ),
            confirmPassword: validateConfirmPassword(
                passwordData.confirmPassword,
                passwordData.newPassword
            ),
        };

        setFieldErrors(errors);

        return !Object.values(errors).some(Boolean);
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            setError("Please correct the highlighted password fields.");
            setMessage("");
            return;
        }

        await runSave(
            "password",
            async () => {
                await changePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                });

                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                setFieldErrors({});
            },
            "Password updated successfully."
        );
    };

    const handleNotificationSave = () =>
        runSave(
            "notifications",
            () => saveUserPreferences({ notificationSettings }),
            "Recruiter notification preferences saved successfully."
        );

    const activeDetails = sections.find(
        (section) => section.id === activeSection
    );

    const ActiveIcon = activeDetails?.icon || User;

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-800">
            <div className="flex min-h-screen w-full flex-col">
                {/* Page heading */}
                <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                            <Settings size={15} />
                            Account management
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Recruiter Settings
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your recruitment account, preferences and security.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 lg:self-center">
                        <Sparkles size={15} />
                        Recruiter workspace
                    </div>
                </header>

                {/* Status messages */}
                {(error || message) && (
                    <div className="px-5 pt-4 sm:px-8">
                        <div
                            role="status"
                            aria-live="polite"
                            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                                error
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                        >
                            {error ? (
                                <Shield size={18} className="mt-0.5 shrink-0" />
                            ) : (
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                            )}

                            <span className="flex-1">{error || message}</span>

                            <button
                                type="button"
                                onClick={() => {
                                    setError("");
                                    setMessage("");
                                }}
                                aria-label="Dismiss message"
                                className="rounded-md px-1 text-lg leading-none opacity-60 transition hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50">
                        <LoaderCircle
                            size={36}
                            className="animate-spin text-indigo-600"
                        />
                        <p className="mt-4 text-sm font-medium text-slate-500">
                            Loading recruiter settings...
                        </p>
                    </div>
                ) : (
                    <div className="grid flex-1 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
                        {/* Sidebar */}
                        <aside className="border-b border-slate-200 bg-white lg:min-h-full lg:border-b-0 lg:border-r">
                            <div className="hidden border-b border-slate-100 px-6 py-5 lg:block">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Settings menu
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Manage your recruiter preferences.
                                </p>
                            </div>

                            <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-1 lg:p-4">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    const selected =
                                        activeSection === section.id;

                                    return (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() =>
                                                handleSectionChange(section.id)
                                            }
                                            aria-current={
                                                selected ? "page" : undefined
                                            }
                                            className={`group flex min-w-fit flex-1 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all lg:flex-none ${
                                                selected
                                                    ? "border-indigo-100 bg-indigo-50"
                                                    : "border-transparent hover:border-slate-100 hover:bg-slate-50"
                                            }`}
                                        >
                                            <span
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                                    selected
                                                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                                        : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                                                }`}
                                            >
                                                <Icon size={19} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span
                                                    className={`block whitespace-nowrap text-sm font-semibold ${
                                                        selected
                                                            ? "text-indigo-700"
                                                            : "text-slate-700"
                                                    }`}
                                                >
                                                    {section.label}
                                                </span>

                                                <span className="mt-0.5 hidden text-[11px] text-slate-400 lg:block">
                                                    {section.description}
                                                </span>
                                            </span>

                                            {selected && (
                                                <ChevronRight
                                                    size={17}
                                                    className="hidden shrink-0 text-indigo-600 lg:block"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="m-4 hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 lg:block">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                    <Shield size={20} />
                                </div>

                                <h3 className="mt-4 text-sm font-bold text-slate-900">
                                    Your workspace, your control
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Manage your recruitment notifications and
                                    keep your recruiter account secure.
                                </p>
                            </div>
                        </aside>

                        {/* Main content */}
                        <main className="min-w-0 bg-slate-50">
                            <div className="flex min-h-full flex-col">
                                {/* Section header */}
                                <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8 sm:py-6">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                                        <ActiveIcon size={23} />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                                                {sectionContent[activeSection].title}
                                            </h2>

                                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                                                {activeDetails?.label}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {sectionContent[activeSection].description}
                                        </p>
                                    </div>
                                </div>

                                {/* Account settings */}
                                {activeSection === "account" && (
                                    <form
                                        onSubmit={handleAccountSave}
                                        noValidate
                                        className="flex flex-1 flex-col"
                                    >
                                        <div className="flex-1 px-5 py-7 sm:px-8 sm:py-9">
                                            <div className="mb-7">
                                                <h3 className="text-base font-bold text-slate-900">
                                                    Contact information
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Your registered recruiter contact details.
                                                </p>
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Fields marked with <span className="font-bold text-red-600">*</span> are required.
                                                </p>
                                            </div>

                                            <div className="grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-2">
                                                <div>
                                                    <FieldLabel htmlFor="recruiter-email">
                                                        Email address
                                                    </FieldLabel>

                                                    <div className="relative">
                                                        <Mail
                                                            size={18}
                                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                        />

                                                        <input
                                                            id="recruiter-email"
                                                            type="email"
                                                            name="email"
                                                            value={accountSettings.email}
                                                            readOnly
                                                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-500 outline-none"
                                                        />
                                                    </div>

                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Your registered email cannot be changed here.
                                                    </p>
                                                </div>

                                                <div>
                                                    <FieldLabel
                                                        htmlFor="recruiter-phone"
                                                        required
                                                    >
                                                        Phone number
                                                    </FieldLabel>

                                                    <input
                                                        id="recruiter-phone"
                                                        type="tel"
                                                        name="phone"
                                                        autoComplete="tel"
                                                        value={accountSettings.phone}
                                                        onChange={handleAccountChange}
                                                        placeholder="Enter your 10-digit phone number"
                                                        maxLength={10}
                                                        aria-invalid={!!fieldErrors.phone}
                                                        aria-describedby={
                                                            fieldErrors.phone
                                                                ? "recruiter-phone-error"
                                                                : undefined
                                                        }
                                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                                                            fieldErrors.phone
                                                                ? "border-red-500 focus:border-red-500 focus:ring-red-50"
                                                                : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                                                        }`}
                                                    />

                                                    <FieldError>
                                                        {fieldErrors.phone}
                                                    </FieldError>

                                                    {!fieldErrors.phone && (
                                                        <p className="mt-2 text-xs text-slate-400">
                                                            Enter a valid 10-digit phone number.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <SaveFooter
                                            loading={saving === "account"}
                                            saved={savedSection === "account"}
                                            disabled={!!saving}
                                            label="Save Changes"
                                        />
                                    </form>
                                )}

                                {/* Notifications */}
                                {activeSection === "notifications" && (
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex-1">
                                            <div className="border-b border-slate-100 bg-white px-5 py-5 sm:px-8">
                                                <h3 className="text-base font-bold text-slate-900">
                                                    Recruitment notifications
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Choose which recruitment updates you want to receive.
                                                </p>
                                            </div>

                                            <div className="divide-y divide-slate-100 bg-white">
                                                <SettingToggle
                                                    icon={Bell}
                                                    title="Application Alerts"
                                                    description="Receive in-app notifications when candidates apply to your job postings."
                                                    enabled={notificationSettings.applicationAlerts}
                                                    onChange={() =>
                                                        handleNotificationChange("applicationAlerts")
                                                    }
                                                    disabled={!!saving}
                                                />

                                                <SettingToggle
                                                    icon={CheckCircle2}
                                                    title="Interview Updates"
                                                    description="Stay informed about scheduled interviews and interview changes."
                                                    enabled={notificationSettings.interviewUpdates}
                                                    onChange={() =>
                                                        handleNotificationChange("interviewUpdates")
                                                    }
                                                    disabled={!!saving}
                                                />

                                                <SettingToggle
                                                    icon={User}
                                                    title="New Candidate Alerts"
                                                    description="Receive alerts about new candidates and recruitment activity."
                                                    enabled={notificationSettings.newCandidateAlerts}
                                                    onChange={() =>
                                                        handleNotificationChange("newCandidateAlerts")
                                                    }
                                                    disabled={!!saving}
                                                />

                                                <SettingToggle
                                                    icon={Mail}
                                                    title="Email Notifications"
                                                    description="Receive important JobBridge recruiter updates through email."
                                                    enabled={notificationSettings.emailNotifications}
                                                    onChange={() =>
                                                        handleNotificationChange("emailNotifications")
                                                    }
                                                    disabled={!!saving}
                                                />
                                            </div>
                                        </div>

                                        <SaveFooter
                                            loading={saving === "notifications"}
                                            saved={savedSection === "notifications"}
                                            disabled={!!saving}
                                            label="Save Preferences"
                                            onClick={handleNotificationSave}
                                        />
                                    </div>
                                )}

                                {/* Password settings */}
                                {activeSection === "password" && (
                                    <form
                                        onSubmit={handlePasswordSave}
                                        noValidate
                                        className="flex flex-1 flex-col"
                                    >
                                        <div className="flex-1 px-5 py-7 sm:px-8 sm:py-9">
                                            <div className="mb-7">
                                                <h3 className="text-base font-bold text-slate-900">
                                                    Change your password
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Choose a strong password to protect your recruiter account.
                                                </p>
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Fields marked with <span className="font-bold text-red-600">*</span> are required.
                                                </p>
                                            </div>

                                            <div className="max-w-3xl space-y-6">
                                                <PasswordInput
                                                    id="recruiter-current-password"
                                                    label="Current password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    show={showCurrentPassword}
                                                    setShow={setShowCurrentPassword}
                                                    disabled={!!saving}
                                                    error={fieldErrors.currentPassword}
                                                    required
                                                />

                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    <PasswordInput
                                                        id="recruiter-new-password"
                                                        label="New password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        show={showNewPassword}
                                                        setShow={setShowNewPassword}
                                                        disabled={!!saving}
                                                        error={fieldErrors.newPassword}
                                                        required
                                                    />

                                                    <PasswordInput
                                                        id="recruiter-confirm-password"
                                                        label="Confirm new password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        show={showConfirmPassword}
                                                        setShow={setShowConfirmPassword}
                                                        disabled={!!saving}
                                                        error={fieldErrors.confirmPassword}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-8 max-w-3xl rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                                                        <Lock size={19} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">
                                                            Create a strong password
                                                        </p>
                                                        <p className="mt-1 text-xs leading-5 text-slate-600">
                                                            Use at least 8 characters and avoid reusing passwords from other websites.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <SaveFooter
                                            loading={saving === "password"}
                                            saved={savedSection === "password"}
                                            disabled={!!saving}
                                            label="Update Password"
                                        />
                                    </form>
                                )}
                            </div>
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
};

const SaveFooter = ({
    loading = false,
    saved = false,
    disabled = false,
    label,
    onClick,
}) => (
    <div className="mt-auto flex justify-end border-t border-slate-200 bg-white px-5 py-5 sm:px-8">
        <SaveButton
            loading={loading}
            saved={saved}
            disabled={disabled}
            label={label}
            onClick={onClick}
        />
    </div>
);

const SaveButton = ({
    loading = false,
    saved = false,
    disabled = false,
    label,
    onClick,
}) => (
    <button
        type={onClick ? "button" : "submit"}
        onClick={onClick}
        disabled={disabled || loading}
        style={{
            backgroundColor: saved && !loading ? "#059669" : PRIMARY,
        }}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
        {loading ? (
            <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving...
            </>
        ) : saved ? (
            <>
                <CheckCircle2 size={18} />
                Saved Successfully
            </>
        ) : (
            <>
                <Save size={17} />
                {label}
            </>
        )}
    </button>
);

const SettingToggle = ({
    icon: Icon,
    title,
    description,
    enabled,
    onChange,
    disabled = false,
}) => (
    <div className="flex items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-slate-50 sm:px-8 sm:py-6">
        <div className="flex min-w-0 items-start gap-4">
            <div
                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    enabled
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-slate-100 text-slate-400"
                }`}
            >
                {Icon && <Icon size={20} />}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-800">
                    {title}
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                    {description}
                </p>

                <span
                    className={`mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        enabled ? "text-indigo-600" : "text-slate-400"
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            enabled ? "bg-indigo-600" : "bg-slate-400"
                        }`}
                    />
                    {enabled ? "Enabled" : "Disabled"}
                </span>
            </div>
        </div>

        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={title}
            disabled={disabled}
            onClick={onChange}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 ${
                enabled ? "bg-indigo-600" : "bg-slate-300"
            }`}
        >
            <span
                className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ${
                    enabled ? "left-6" : "left-1"
                }`}
            >
                {enabled && (
                    <Check size={10} className="text-indigo-600" />
                )}
            </span>
        </button>
    </div>
);

const PasswordInput = ({
    id,
    label,
    name,
    value,
    onChange,
    show,
    setShow,
    disabled = false,
    error = "",
    required = false,
}) => (
    <div className="min-w-0">
        <FieldLabel htmlFor={id} required={required}>
            {label}
        </FieldLabel>

        <div className="relative">
            <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                id={id}
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                autoComplete={
                    name === "currentPassword"
                        ? "current-password"
                        : "new-password"
                }
                placeholder={`Enter ${label.toLowerCase()}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:bg-slate-50 ${
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
            />

            <button
                type="button"
                disabled={disabled}
                onClick={() => setShow((prev) => !prev)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>

        <FieldError>{error}</FieldError>
    </div>
);

export default RecruiterSetting;
