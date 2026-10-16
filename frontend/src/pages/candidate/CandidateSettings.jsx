
import {
    Bell,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    LoaderCircle,
    Lock,
    Mail,
    Save,
    Shield,
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

const CandidateSettings = () => {
    const [activeSection, setActiveSection] = useState("account");

    const [accountSettings, setAccountSettings] = useState({
        email: "",
        phone: "",
    });

    const [notificationSettings, setNotificationSettings] = useState({
        jobAlerts: true,
        applicationUpdates: true,
        interviewReminders: true,
        emailNotifications: true,
    });

    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: true,
        resumeVisibility: true,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

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

                setPrivacySettings((prev) => ({
                    ...prev,
                    ...(preferences.privacySettings || {}),
                }));
            })
            .catch((err) => {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                            "Unable to load account settings."
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

    const sections = [
        {
            id: "account",
            label: "Account",
            description: "Personal information",
            icon: User,
        },
        {
            id: "notifications",
            label: "Notifications",
            description: "Manage your alerts",
            icon: Bell,
        },
        {
            id: "privacy",
            label: "Privacy",
            description: "Control your visibility",
            icon: Shield,
        },
        {
            id: "password",
            label: "Password & Security",
            description: "Keep your account secure",
            icon: Lock,
        },
    ];

    const handleAccountChange = (e) => {
        const { name, value } = e.target;

        setAccountSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNotificationChange = (name) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const handlePrivacyChange = (name) => {
        setPrivacySettings((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
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
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to save your changes. Please try again."
            );
        } finally {
            setSaving("");
        }
    };

    const handleAccountSave = async (e) => {
        e.preventDefault();

        await runSave(
            "account",
            () => updateCurrentUser({ phone: accountSettings.phone }),
            "Account settings saved successfully."
        );
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            setError("Please fill in all password fields.");
            setMessage("");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New password and confirm password do not match.");
            setMessage("");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError("Your new password must contain at least 8 characters.");
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
            },
            "Password updated successfully."
        );
    };

    const handleNotificationSave = () =>
        runSave(
            "notifications",
            () => saveUserPreferences({ notificationSettings }),
            "Notification preferences saved successfully."
        );

    const handlePrivacySave = () =>
        runSave(
            "privacy",
            () => saveUserPreferences({ privacySettings }),
            "Privacy preferences saved successfully."
        );

    const activeDetails = sections.find(
        (section) => section.id === activeSection
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-800">
            {/* Full-width page header */}
            <header className="w-full border-b border-blue-100 bg-white">
                <div className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-9">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
                            <Shield size={22} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Settings
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Manage your JobBridge account and preferences.
                            </p>
                        </div>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        Account preferences
                    </div>
                </div>
            </header>

            {/* Main page area */}
            <main className="w-full px-3 py-4 sm:px-5 sm:py-5 lg:px-7">
                {/* Status messages */}
                {(error || message) && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${
                            error
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {error ? (
                            <Shield size={19} className="mt-0.5 shrink-0" />
                        ) : (
                            <CheckCircle2
                                size={19}
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
                            className="rounded-md px-1 text-lg leading-none opacity-70 transition hover:opacity-100"
                        >
                            ×
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex min-h-[55vh] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
                        <LoaderCircle
                            size={32}
                            className="animate-spin text-blue-600"
                        />
                        <p className="text-sm font-medium text-slate-500">
                            Loading your settings...
                        </p>
                    </div>
                ) : (
                    <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-5">
                        {/* Desktop sidebar */}
                        <aside className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                            <div className="border-b border-slate-100 px-5 py-4">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Preferences
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Manage your account settings
                                </p>
                            </div>

                            <nav className="space-y-1.5 p-3">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    const selected =
                                        activeSection === section.id;

                                    return (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() => {
                                                setActiveSection(section.id);
                                                setError("");
                                                setMessage("");
                                            }}
                                            className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                                                selected
                                                    ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                                                    : "border-transparent text-slate-600 hover:border-slate-100 hover:bg-slate-50"
                                            }`}
                                        >
                                            <span
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                                    selected
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                                                }`}
                                            >
                                                <Icon size={19} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold">
                                                    {section.label}
                                                </span>
                                                <span
                                                    className={`mt-0.5 block text-xs ${
                                                        selected
                                                            ? "text-blue-600"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {section.description}
                                                </span>
                                            </span>

                                            {selected && (
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mx-3 mb-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
                                <div className="mb-2 flex items-center gap-2 text-blue-700">
                                    <Shield size={17} />
                                    <span className="text-xs font-bold">
                                        Your account, your choice
                                    </span>
                                </div>
                                <p className="text-xs leading-5 text-slate-500">
                                    Keep your preferences updated to get a
                                    better job-search experience.
                                </p>
                            </div>
                        </aside>

                        {/* Mobile section navigation */}
                        <nav
                            aria-label="Settings sections"
                            className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden"
                        >
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const selected =
                                    activeSection === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            setError("");
                                            setMessage("");
                                        }}
                                        className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                            selected
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <Icon size={17} />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Settings content */}
                        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Panel heading */}
                            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                    {activeDetails &&
                                        (() => {
                                            const Icon = activeDetails.icon;
                                            return <Icon size={21} />;
                                        })()}
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                        {activeSection === "account" &&
                                            "Account Settings"}
                                        {activeSection === "notifications" &&
                                            "Notification Settings"}
                                        {activeSection === "privacy" &&
                                            "Privacy Settings"}
                                        {activeSection === "password" &&
                                            "Password & Security"}
                                    </h2>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                                        {activeSection === "account" &&
                                            "Manage your contact information."}
                                        {activeSection === "notifications" &&
                                            "Choose which updates you want to receive."}
                                        {activeSection === "privacy" &&
                                            "Control how recruiters can view your profile."}
                                        {activeSection === "password" &&
                                            "Update your password to help keep your account secure."}
                                    </p>
                                </div>
                            </div>

                            {/* Account */}
                            {activeSection === "account" && (
                                <form
                                    onSubmit={handleAccountSave}
                                    className="space-y-5 p-4 sm:p-6"
                                >
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="settings-email"
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
                                                    id="settings-email"
                                                    type="email"
                                                    name="email"
                                                    value={accountSettings.email}
                                                    readOnly
                                                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-500 outline-none"
                                                />
                                            </div>

                                            <p className="mt-2 text-xs text-slate-400">
                                                Your registered email cannot
                                                be changed here.
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <label
                                                htmlFor="settings-phone"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Phone number
                                            </label>

                                            <input
                                                id="settings-phone"
                                                type="tel"
                                                name="phone"
                                                autoComplete="tel"
                                                value={accountSettings.phone}
                                                onChange={handleAccountChange}
                                                placeholder="Enter your phone number"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            />

                                            <p className="mt-2 text-xs text-slate-400">
                                                Keep your contact details
                                                up to date.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end border-t border-slate-100 pt-5">
                                        <SaveButton
                                            loading={saving === "account"}
                                            saved={savedSection === "account"}
                                            disabled={!!saving}
                                            label="Save Changes"
                                        />
                                    </div>
                                </form>
                            )}

                            {/* Notifications */}
                            {activeSection === "notifications" && (
                                <div>
                                    <div className="divide-y divide-slate-100">
                                        <SettingToggle
                                            title="Job Alerts"
                                            description="Receive alerts about new jobs matching your interests."
                                            enabled={notificationSettings.jobAlerts}
                                            onChange={() =>
                                                handleNotificationChange(
                                                    "jobAlerts"
                                                )
                                            }
                                            disabled={!!saving}
                                        />

                                        <SettingToggle
                                            title="Application Updates"
                                            description="Know when the status of your job application changes."
                                            enabled={notificationSettings.applicationUpdates}
                                            onChange={() =>
                                                handleNotificationChange(
                                                    "applicationUpdates"
                                                )
                                            }
                                            disabled={!!saving}
                                        />

                                        <SettingToggle
                                            title="Interview Reminders"
                                            description="Get reminders about your upcoming interviews."
                                            enabled={notificationSettings.interviewReminders}
                                            onChange={() =>
                                                handleNotificationChange(
                                                    "interviewReminders"
                                                )
                                            }
                                            disabled={!!saving}
                                        />

                                        <SettingToggle
                                            title="Email Notifications"
                                            description="Receive important JobBridge updates through email."
                                            enabled={notificationSettings.emailNotifications}
                                            onChange={() =>
                                                handleNotificationChange(
                                                    "emailNotifications"
                                                )
                                            }
                                            disabled={!!saving}
                                        />
                                    </div>

                                    <div className="flex justify-end border-t border-slate-100 px-4 py-4 sm:px-6">
                                        <SaveButton
                                            loading={saving === "notifications"}
                                            saved={savedSection === "notifications"}
                                            disabled={!!saving}
                                            label="Save Preferences"
                                            onClick={handleNotificationSave}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Privacy */}
                            {activeSection === "privacy" && (
                                <div>
                                    <div className="divide-y divide-slate-100">
                                        <SettingToggle
                                            title="Profile Visibility"
                                            description="Allow recruiters to view your candidate profile."
                                            enabled={privacySettings.profileVisibility}
                                            onChange={() =>
                                                handlePrivacyChange(
                                                    "profileVisibility"
                                                )
                                            }
                                            disabled={!!saving}
                                        />

                                        <SettingToggle
                                            title="Resume Visibility"
                                            description="Allow recruiters to access your resume when you apply for their jobs."
                                            enabled={privacySettings.resumeVisibility}
                                            onChange={() =>
                                                handlePrivacyChange(
                                                    "resumeVisibility"
                                                )
                                            }
                                            disabled={!!saving}
                                        />
                                    </div>

                                    <div className="flex justify-end border-t border-slate-100 px-4 py-4 sm:px-6">
                                        <SaveButton
                                            loading={saving === "privacy"}
                                            saved={savedSection === "privacy"}
                                            disabled={!!saving}
                                            label="Save Privacy Settings"
                                            onClick={handlePrivacySave}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password */}
                            {activeSection === "password" && (
                                <form
                                    onSubmit={handlePasswordSave}
                                    className="space-y-5 p-4 sm:p-6"
                                >
                                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                        <PasswordInput
                                            id="current-password"
                                            label="Current password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            show={showCurrentPassword}
                                            setShow={setShowCurrentPassword}
                                            disabled={!!saving}
                                        />

                                        <div className="hidden xl:block" />

                                        <PasswordInput
                                            id="new-password"
                                            label="New password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            show={showNewPassword}
                                            setShow={setShowNewPassword}
                                            disabled={!!saving}
                                        />

                                        <PasswordInput
                                            id="confirm-password"
                                            label="Confirm new password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            show={showConfirmPassword}
                                            setShow={setShowConfirmPassword}
                                            disabled={!!saving}
                                        />
                                    </div>

                                    <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                                        <div className="flex items-start gap-3">
                                            <Lock
                                                size={18}
                                                className="mt-0.5 shrink-0 text-blue-600"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Password tips
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                                    Use at least 8 characters
                                                    and choose a password you
                                                    do not use on other
                                                    websites.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end border-t border-slate-100 pt-5">
                                        <SaveButton
                                            loading={saving === "password"}
                                            saved={savedSection === "password"}
                                            disabled={!!saving}
                                            label="Update Password"
                                        />
                                    </div>
                                </form>
                            )}
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

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
        className={`group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-75 ${
            saved && !loading
                ? "bg-emerald-600 shadow-emerald-100"
                : "bg-blue-600 shadow-blue-100 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0"
        }`}
    >
        {loading ? (
            <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving...
            </>
        ) : saved ? (
            <>
                <CheckCircle2
                    size={18}
                    className="animate-[savePop_0.3s_ease-out]"
                />
                Saved Successfully
            </>
        ) : (
            <>
                <Save
                    size={17}
                    className="transition-transform duration-200 group-hover:scale-110"
                />
                {label}
            </>
        )}
    </button>
);

const SettingToggle = ({
    title,
    description,
    enabled,
    onChange,
    disabled = false,
}) => (
    <div className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50/70 sm:px-6 sm:py-5">
        <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                {description}
            </p>
        </div>

        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={title}
            disabled={disabled}
            onClick={onChange}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                enabled ? "bg-blue-600" : "bg-slate-300"
            }`}
        >
            <span
                className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ${
                    enabled ? "left-6" : "left-1"
                }`}
            >
                {enabled && (
                    <Check size={10} className="text-blue-600" />
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
}) => (
    <div className="min-w-0">
        <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-slate-700"
        >
            {label}
        </label>

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
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"
            />

            <button
                type="button"
                disabled={disabled}
                onClick={() => setShow((prev) => !prev)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    </div>
);

export default CandidateSettings;
