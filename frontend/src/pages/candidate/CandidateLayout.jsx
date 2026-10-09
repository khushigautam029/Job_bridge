import {
    Bell,
    Bookmark,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    FileText,
    LogOut,
    Menu,
    Search,
    Settings,
    User,
    UserCircle,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const CandidateLayout = () => {
    const navigate = useNavigate();

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const notificationRef = useRef(null);

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userName = storedUser?.name || "Candidate";
    const userRole = storedUser?.role || "CANDIDATE";

    // NOTIFICATIONS
    const notifications = [
        {
            id: 1,
            title: "Application Submitted",
            message:
                "Your application for Senior React Developer at TechNova Solutions has been submitted successfully.",
            time: "10 min ago",
            icon: FileText,
        },
        {
            id: 2,
            title: "Application Shortlisted",
            message:
                "Your application for Backend Developer at CloudCore Technologies has been shortlisted.",
            time: "2 hours ago",
            icon: BriefcaseBusiness,
        },
        {
            id: 3,
            title: "Interview Scheduled",
            message:
                "Your interview for Senior React Developer has been scheduled for August 28 at 11:00 AM.",
            time: "5 hours ago",
            icon: CalendarDays,
        },
        {
            id: 4,
            title: "New Job Recommendation",
            message:
                "A new MERN Stack Developer position matches your profile and skills.",
            time: "Yesterday",
            icon: Search,
        },
        {
            id: 5,
            title: "Complete Your Profile",
            message:
                "Your candidate profile is 80% complete. Add your skills and portfolio to improve your profile.",
            time: "2 days ago",
            icon: User,
        },
    ];

    // CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
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

    // CANDIDATE NAVIGATION
    const navigation = [
        {
            title: "Find Jobs",
            icon: Search,
            path: "/candidate/jobs",
        },
        {
            title: "Applications",
            icon: FileText,
            path: "/candidate/applications",
        },
        {
            title: "Saved Jobs",
            icon: Bookmark,
            path: "/candidate/saved-jobs",
        },
        {
            title: "Interviews",
            icon: CalendarDays,
            path: "/candidate/interviews",
        },
    ];

    // CLOSE MENUS
    const closeMenus = () => {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
        setNotificationOpen(false);
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        closeMenus();

        navigate("/login");
    };

    // PROFILE
    const handleProfileClick = () => {
        closeMenus();

        navigate("/candidate/profile");
    };

    // SETTINGS
    const handleSettingsClick = () => {
        closeMenus();

        navigate("/candidate/settings");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* HEADER */}

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-8">
                    {/* LOGO */}
                    <button
                        type="button"
                        onClick={() => navigate("/", { replace: true })}
                        className="flex shrink-0 items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Job
                            <span className="text-indigo-600">Bridge</span>
                        </span>
                    </button>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="hidden items-center gap-0.5 lg:flex">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    end={item.path === "/candidate/jobs"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        }`
                                    }
                                >
                                    <Icon size={16} />
                                    {item.title}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-1.5">

                        {/* NOTIFICATIONS */}
                        <div ref={notificationRef} className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setNotificationOpen((previous) => !previous)
                                }
                                className={`relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 ${notificationOpen
                                        ? "bg-slate-100 text-indigo-600"
                                        : ""
                                    }`}
                                title="Notifications"
                                aria-label="Notifications"
                            >
                                <Bell size={19} />

                                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600" />
                            </button>

                            {/* NOTIFICATION DROPDOWN */}
                            {notificationOpen && (
                                <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

                                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                        <h3 className="text-sm font-bold text-slate-900">
                                            Notifications
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => setNotificationOpen(false)}
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                            aria-label="Close notifications"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="max-h-[420px] overflow-y-auto">
                                        {notifications.map((notification) => {
                                            const Icon = notification.icon;

                                            return (
                                                <div
                                                    key={notification.id}
                                                    className="flex gap-3 border-b border-slate-100 px-4 py-3 transition last:border-b-0 hover:bg-slate-50"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                        <Icon size={17} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-xs font-semibold text-slate-800">
                                                            {notification.title}
                                                        </h4>

                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            {notification.message}
                                                        </p>

                                                        <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PROFILE */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileMenuOpen((previous) => !previous)
                                }
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition ${profileMenuOpen
                                        ? "bg-slate-100"
                                        : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <User size={17} />
                                </div>

                                <div className="hidden text-left sm:block">
                                    <p className="max-w-[120px] truncate text-sm font-semibold leading-4 text-slate-800">
                                        {userName}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        {userRole === "RECRUITER"
                                            ? "Recruiter"
                                            : userRole === "ADMIN"
                                                ? "Administrator"
                                                : "Candidate"}
                                    </p>
                                </div>

                                <ChevronDown
                                    size={15}
                                    className={`hidden text-slate-400 transition-transform sm:block ${profileMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* PROFILE DROPDOWN */}
                            {profileMenuOpen && (
                                <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">

                                    <div className="border-b border-slate-100 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                <User size={17} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {userName}
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    {userRole === "RECRUITER"
                                                        ? "Recruiter"
                                                        : userRole === "ADMIN"
                                                            ? "Administrator"
                                                            : "Candidate"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleProfileClick}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <UserCircle size={17} />
                                            View and Update profile
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSettingsClick}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Settings size={17} />
                                            Settings
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-100 p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen((previous) => !previous)
                            }
                            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white lg:hidden">
                        <nav className="mx-auto max-w-[1400px] px-5 py-3 sm:px-7 lg:px-8">
                            <div className="space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.title}
                                            to={item.path}
                                            end={item.path === "/candidate/jobs"}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive
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


            {/* PAGE CONTENT */}
            <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-7 lg:px-10">

                <section>
                    <Outlet />
                </section>

            </main>

        </div>
    );
};

export default CandidateLayout;