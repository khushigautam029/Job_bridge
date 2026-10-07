import {
    Bell,
    Eye,
    EyeOff,
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

    useEffect(() => {
        let active = true;
        getCurrentUser()
            .then(({ user }) => {
                if (active) {
                    setAccountSettings({
                        email: user.email || "",
                        phone: user.phone || "",
                    });
                }
            })
            .catch((loadError) => {
                if (active) {
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load account settings."
                    );
                }
            });

        return () => {
            active = false;
        };
    }, []);

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

    const handleAccountSave = async (e) => {
        e.preventDefault();

        try {
            await updateCurrentUser({
                phone: accountSettings.phone,
            });
            setError("");
            setMessage("Account settings saved successfully.");
        } catch (saveError) {
            setMessage("");
            setError(
                saveError.response?.data?.message ||
                "Unable to save account settings."
            );
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setError("");
            setMessage("Password updated successfully.");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (saveError) {
            setMessage("");
            setError(
                saveError.response?.data?.message ||
                "Unable to update your password."
            );
        }
    };

    const handleNotificationSave = () => {
        setMessage("");
        setError("Notification preferences cannot be saved because the backend does not support them yet.");
    };

    const handlePrivacySave = () => {
        setMessage("");
        setError("Privacy preferences cannot be saved because the backend does not support them yet.");
    };

    const sections = [
        {
            id: "account",
            label: "Account",
            icon: User,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
        },
        {
            id: "privacy",
            label: "Privacy",
            icon: Shield,
        },
        {
            id: "password",
            label: "Password & Security",
            icon: Lock,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
            {(error || message) && (
                <div className={`mx-auto mb-4 max-w-6xl rounded-lg p-3 text-sm ${
                    error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}>
                    {error || message}
                </div>
            )}
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your account, notifications and privacy settings.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {/* Sidebar */}
                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                        {sections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() =>
                                        setActiveSection(section.id)
                                    }
                                    className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                                        activeSection === section.id
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon size={18} />

                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                        {/* Account */}
                        {activeSection === "account" && (
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                            <User size={20} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Account Settings
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Manage your account contact
                                                information.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleAccountSave}
                                    className="space-y-6 p-6"
                                >
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>

                                        <div className="relative">
                                            <Mail
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="email"
                                                name="email"
                                                value={accountSettings.email}
                                                readOnly
                                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            value={accountSettings.phone}
                                            onChange={handleAccountChange}
                                            placeholder="Enter your phone number"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        <Save size={17} />
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeSection === "notifications" && (
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                            <Bell size={20} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Notification Settings
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Choose which notifications you
                                                want to receive.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    <SettingToggle
                                        title="Job Alerts"
                                        description="Receive notifications about new jobs matching your interests."
                                        enabled={
                                            notificationSettings.jobAlerts
                                        }
                                        onChange={() =>
                                            handleNotificationChange(
                                                "jobAlerts"
                                            )
                                        }
                                    />

                                    <SettingToggle
                                        title="Application Updates"
                                        description="Get notified when there is an update to your job application."
                                        enabled={
                                            notificationSettings.applicationUpdates
                                        }
                                        onChange={() =>
                                            handleNotificationChange(
                                                "applicationUpdates"
                                            )
                                        }
                                    />

                                    <SettingToggle
                                        title="Interview Reminders"
                                        description="Receive reminders about upcoming interviews."
                                        enabled={
                                            notificationSettings.interviewReminders
                                        }
                                        onChange={() =>
                                            handleNotificationChange(
                                                "interviewReminders"
                                            )
                                        }
                                    />

                                    <SettingToggle
                                        title="Email Notifications"
                                        description="Receive important JobBridge updates through email."
                                        enabled={
                                            notificationSettings.emailNotifications
                                        }
                                        onChange={() =>
                                            handleNotificationChange(
                                                "emailNotifications"
                                            )
                                        }
                                    />
                                </div>

                                <div className="border-t border-gray-200 p-6">
                                    <button
                                        onClick={handleNotificationSave}
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        <Save size={17} />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Privacy */}
                        {activeSection === "privacy" && (
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                            <Shield size={20} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Privacy Settings
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Control how recruiters can see
                                                your profile.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    <SettingToggle
                                        title="Profile Visibility"
                                        description="Allow recruiters to view your candidate profile."
                                        enabled={
                                            privacySettings.profileVisibility
                                        }
                                        onChange={() =>
                                            handlePrivacyChange(
                                                "profileVisibility"
                                            )
                                        }
                                    />

                                    <SettingToggle
                                        title="Resume Visibility"
                                        description="Allow recruiters to access your resume when you apply for their job."
                                        enabled={
                                            privacySettings.resumeVisibility
                                        }
                                        onChange={() =>
                                            handlePrivacyChange(
                                                "resumeVisibility"
                                            )
                                        }
                                    />
                                </div>

                                <div className="border-t border-gray-200 p-6">
                                    <button
                                        onClick={handlePrivacySave}
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        <Save size={17} />
                                        Save Privacy Settings
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        {activeSection === "password" && (
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                            <Lock size={20} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Password & Security
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Keep your JobBridge account
                                                secure.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handlePasswordSave}
                                    className="space-y-5 p-6"
                                >
                                    <PasswordInput
                                        label="Current Password"
                                        name="currentPassword"
                                        value={
                                            passwordData.currentPassword
                                        }
                                        onChange={handlePasswordChange}
                                        show={showCurrentPassword}
                                        setShow={setShowCurrentPassword}
                                    />

                                    <PasswordInput
                                        label="New Password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        show={showNewPassword}
                                        setShow={setShowNewPassword}
                                    />

                                    <PasswordInput
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        value={
                                            passwordData.confirmPassword
                                        }
                                        onChange={handlePasswordChange}
                                        show={showConfirmPassword}
                                        setShow={setShowConfirmPassword}
                                    />

                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        <Save size={17} />
                                        Update Password
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingToggle = ({
    title,
    description,
    enabled,
    onChange,
}) => {
    return (
        <div className="flex items-center justify-between gap-4 p-6">
            <div>
                <h3 className="text-sm font-medium text-gray-900">
                    {title}
                </h3>

                <p className="mt-1 max-w-xl text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={onChange}
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
                    enabled ? "bg-blue-600" : "bg-gray-300"
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        enabled ? "left-6" : "left-1"
                    }`}
                />
            </button>
        </div>
    );
};

const PasswordInput = ({
    label,
    name,
    value,
    onChange,
    show,
    setShow,
}) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default CandidateSettings;
