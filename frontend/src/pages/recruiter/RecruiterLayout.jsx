import {
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    FileText,
    LogOut,
    Menu,
    Settings,
    User,
    UserCircle,
    Users,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const RecruiterLayout = () => {
    const navigate = useNavigate();

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const notificationRef = useRef(null);

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userName = storedUser?.name || "Recruiter";
    const userEmail = storedUser?.email || "";

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    const notifications = [
        {
            id: 1,
            title: "New Application Received",
            message:
                "Rahul Sharma has applied for your Senior React Developer position.",
            time: "15 min ago",
            icon: FileText,
        },
        {
            id: 2,
            title: "New Application Received",
            message:
                "Khushi Gautam has applied for your MERN Stack Developer position.",
            time: "1 hour ago",
            icon: FileText,
        },
        {
            id: 3,
            title: "Interview Scheduled",
            message:
                "An interview has been scheduled with Rahul Sharma for Senior React Developer.",
            time: "3 hours ago",
            icon: CalendarDays,
        },
        {
            id: 4,
            title: "Job Closing Soon",
            message:
                "Your Backend Developer job posting will reach its application deadline in 2 days.",
            time: "Yesterday",
            icon: BriefcaseBusiness,
        },
        {
            id: 5,
            title: "New Candidate Activity",
            message:
                "A candidate who applied to your job has updated their profile and resume.",
            time: "2 days ago",
            icon: Users,
        },
    ];

    // =====================================================
    // CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
    // =====================================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // =====================================================
    // NAVIGATION
    // =====================================================

    const navigation = [
        {
            title: "Jobs",
            icon: BriefcaseBusiness,
            path: "/recruiter/jobs",
        },
        {
            title: "Applications",
            icon: FileText,
            path: "/recruiter/applications",
        },
        {
            title: "Candidates",
            icon: Users,
            path: "/recruiter/candidates",
        },
        {
            title: "Interviews",
            icon: CalendarDays,
            path: "/recruiter/interviews",
        },
    ];

    // =====================================================
    // CLOSE MENUS
    // =====================================================

    const closeMenus = () => {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
        setNotificationOpen(false);
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        closeMenus();

        navigate("/login");
    };

    // =====================================================
    // PROFILE
    // =====================================================

    const handleProfile = () => {
        closeMenus();

        navigate("/recruiter/profile");
    };

    // =====================================================
    // SETTINGS
    // =====================================================

    const handleSettings = () => {
        closeMenus();

        navigate("/recruiter/settings");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:px-10">
                    {/* =====================================================
                        LOGO
                    ===================================================== */}

                    <button
                        type="button"
                        onClick={() => navigate("/recruiter/jobs")}
                        className="flex items-center gap-2.5"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job
                            <span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </button>

                    {/* =====================================================
                        DESKTOP NAVIGATION
                    ===================================================== */}

                    <nav className="hidden items-center gap-1 lg:flex">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    end={
                                        item.path ===
                                        "/recruiter/jobs"
                                    }
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        }`
                                    }
                                >
                                    <Icon size={17} />

                                    {item.title}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* =====================================================
                        RIGHT SIDE
                    ===================================================== */}

                    <div className="flex items-center gap-2">
                        {/* =================================================
                            NOTIFICATIONS
                        ================================================= */}

                        <div
                            ref={notificationRef}
                            className="relative"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setNotificationOpen(
                                        (previous) => !previous
                                    )
                                }
                                className={`relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 ${
                                    notificationOpen
                                        ? "bg-slate-100 text-indigo-600"
                                        : ""
                                }`}
                                title="Notifications"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />

                                {/* Notification Indicator */}

                                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600" />
                            </button>

                            {/* =================================================
                                NOTIFICATION DROPDOWN
                            ================================================= */}

                            {notificationOpen && (
                                <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                                    {/* Header */}

                                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                                        <h3 className="text-sm font-bold text-slate-900">
                                            Notifications
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNotificationOpen(
                                                    false
                                                )
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                            aria-label="Close notifications"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Notification List */}

                                    <div className="max-h-[420px] overflow-y-auto">
                                        {notifications.map(
                                            (notification) => {
                                                const Icon =
                                                    notification.icon;

                                                return (
                                                    <div
                                                        key={
                                                            notification.id
                                                        }
                                                        className="flex gap-3 border-b border-slate-100 px-4 py-3.5 transition last:border-b-0 hover:bg-slate-50"
                                                    >
                                                        {/* Icon */}

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                            <Icon
                                                                size={17}
                                                            />
                                                        </div>

                                                        {/* Content */}

                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-xs font-semibold text-slate-800">
                                                                {
                                                                    notification.title
                                                                }
                                                            </h4>

                                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>

                                                            <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                                                                {
                                                                    notification.time
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            PROFILE MENU
                        ================================================= */}

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileMenuOpen(
                                        (prev) => !prev
                                    )
                                }
                                className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition ${
                                    profileMenuOpen
                                        ? "bg-slate-100"
                                        : "hover:bg-slate-50"
                                }`}
                            >
                                {/* Profile Avatar */}

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <User size={18} />
                                </div>

                                {/* User Information */}

                                <div className="hidden text-left md:block">
                                    <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                                        {userName}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Recruiter
                                    </p>
                                </div>

                                {/* Dropdown Arrow */}

                                <ChevronDown
                                    size={16}
                                    className={`hidden text-slate-400 transition-transform md:block ${
                                        profileMenuOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {/* =================================================
                                PROFILE DROPDOWN
                            ================================================= */}

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                                    {/* User Info */}

                                    <div className="border-b border-slate-100 px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                <User size={18} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {userName}
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    {userEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}

                                    <div className="p-1.5">
                                        {/* My Profile */}

                                        <button
                                            type="button"
                                            onClick={handleProfile}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <UserCircle size={18} />

                                            My Profile
                                        </button>

                                        {/* Settings */}

                                        <button
                                            type="button"
                                            onClick={handleSettings}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Settings size={18} />

                                            Settings
                                        </button>
                                    </div>

                                    {/* Logout */}

                                    <div className="border-t border-slate-100 p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                        >
                                            <LogOut size={18} />

                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            MOBILE MENU BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    (prev) => !prev
                                )
                            }
                            className="rounded-lg p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? (
                                <X size={21} />
                            ) : (
                                <Menu size={21} />
                            )}
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    MOBILE NAVIGATION
                ===================================================== */}

                {mobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white lg:hidden">
                        <nav className="mx-auto max-w-[1440px] px-5 py-3">
                            <div className="space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.title}
                                            to={item.path}
                                            end={
                                                item.path ===
                                                "/recruiter/jobs"
                                            }
                                            onClick={() =>
                                                setMobileMenuOpen(
                                                    false
                                                )
                                            }
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                                                    isActive
                                                        ? "bg-indigo-50 text-indigo-600"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                }`
                                            }
                                        >
                                            <Icon size={18} />

                                            {item.title}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* =========================================================
                PAGE CONTENT
            ========================================================= */}

            <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-7 lg:px-10">
                <section>
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default RecruiterLayout;
