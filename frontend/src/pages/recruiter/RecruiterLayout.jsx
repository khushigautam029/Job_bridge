import {
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    Trash2,
    User,
    UserCircle,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const RecruiterLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const navigate = useNavigate();

    const navigation = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/recruiter/dashboard",
        },
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );

        if (confirmed) {
            console.log("Delete account clicked");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* ==================== MOBILE OVERLAY ==================== */}

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ==================== SIDEBAR ==================== */}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
                    sidebarCollapsed
                        ? "w-20"
                        : "w-64"
                } ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                } lg:translate-x-0`}
            >

                {/* ==================== SIDEBAR HEADER ==================== */}

                <div
                    className={`flex h-20 items-center border-b border-slate-200 ${
                        sidebarCollapsed
                            ? "justify-center px-3"
                            : "justify-between px-5"
                    }`}
                >

                    {/* Logo + Name */}

                    <div className="flex items-center gap-2">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                            <BriefcaseBusiness size={21} />
                        </div>

                        {!sidebarCollapsed && (
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Job
                                <span className="text-indigo-600">
                                    Bridge
                                </span>
                            </span>
                        )}

                    </div>

                    {/* ==================== DESKTOP COLLAPSE ARROW ==================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarCollapsed(
                                !sidebarCollapsed
                            )
                        }
                        className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 lg:block"
                        title={
                            sidebarCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>

                    {/* ==================== MOBILE CLOSE ==================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                    >
                        <X size={21} />
                    </button>

                </div>

                {/* ==================== NAVIGATION ==================== */}

                <div className="flex-1 overflow-y-auto px-3 py-6">

                    {!sidebarCollapsed && (
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Hiring
                        </p>
                    )}

                    <nav className="space-y-1">

                        {navigation.map((item) => {

                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    onClick={() =>
                                        setSidebarOpen(false)
                                    }
                                    title={
                                        sidebarCollapsed
                                            ? item.title
                                            : ""
                                    }
                                    className={({ isActive }) =>
                                        `flex w-full items-center rounded-xl py-3 text-sm font-medium transition ${
                                            sidebarCollapsed
                                                ? "justify-center px-3"
                                                : "gap-3 px-3"
                                        } ${
                                            isActive
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        }`
                                    }
                                >

                                    <Icon size={19} />

                                    {!sidebarCollapsed && (
                                        <span>
                                            {item.title}
                                        </span>
                                    )}

                                </NavLink>
                            );
                        })}

                    </nav>

                </div>

            </aside>

            {/* ==================== MAIN AREA ==================== */}

            <div
                className={`transition-all duration-300 ${
                    sidebarCollapsed
                        ? "lg:pl-20"
                        : "lg:pl-64"
                }`}
            >

                {/* ==================== NAVBAR ==================== */}

                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

                    <div className="flex h-20 items-center justify-between px-5 sm:px-7 lg:px-8">

                        {/* Mobile Menu */}

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                        >
                            <Menu size={22} />
                        </button>

                        {/* Right Side */}

                        <div className="ml-auto flex items-center gap-3">

                            {/* Notification */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/recruiter/notifications"
                                    )
                                }
                                className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                            >
                                <Bell size={20} />

                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600" />
                            </button>

                            {/* Profile Dropdown */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setProfileOpen(
                                            !profileOpen
                                        )
                                    }
                                    className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                                >

                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <User size={18} />
                                    </div>

                                    <div className="hidden text-left sm:block">

                                        <p className="text-sm font-semibold text-slate-800">
                                            Khushi Gautam
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Recruiter
                                        </p>

                                    </div>

                                    <ChevronDown
                                        size={16}
                                        className={`hidden text-slate-400 transition sm:block ${
                                            profileOpen
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />

                                </button>

                                {/* ==================== PROFILE DROPDOWN ==================== */}

                                {profileOpen && (
                                    <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                                        {/* User Information */}

                                        <div className="border-b border-slate-100 px-4 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                    <User size={20} />
                                                </div>

                                                <div>

                                                    <p className="text-sm font-semibold text-slate-800">
                                                        Khushi Gautam
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        Recruiter
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {/* Profile / Settings */}

                                        <div className="p-2">

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate(
                                                        "/recruiter/profile"
                                                    );
                                                    setProfileOpen(
                                                        false
                                                    );
                                                }}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                <UserCircle
                                                    size={18}
                                                />
                                                My Profile
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    console.log(
                                                        "Settings clicked"
                                                    );
                                                    setProfileOpen(
                                                        false
                                                    );
                                                }}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                <Settings
                                                    size={18}
                                                />
                                                Settings
                                            </button>

                                            {/* Theme */}

                                            <div className="flex items-center justify-between rounded-xl px-3 py-2.5">

                                                <div className="flex items-center gap-3">

                                                    {darkMode ? (
                                                        <Moon
                                                            size={18}
                                                            className="text-slate-500"
                                                        />
                                                    ) : (
                                                        <Sun
                                                            size={18}
                                                            className="text-slate-500"
                                                        />
                                                    )}

                                                    <span className="text-sm font-medium text-slate-600">
                                                        {darkMode
                                                            ? "Dark Mode"
                                                            : "Light Mode"}
                                                    </span>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDarkMode(
                                                            !darkMode
                                                        )
                                                    }
                                                    className={`relative h-6 w-11 rounded-full transition ${
                                                        darkMode
                                                            ? "bg-indigo-600"
                                                            : "bg-slate-300"
                                                    }`}
                                                >

                                                    <span
                                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                            darkMode
                                                                ? "left-6"
                                                                : "left-1"
                                                        }`}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                        {/* Logout / Delete */}

                                        <div className="border-t border-slate-100 p-2">

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleDeleteAccount
                                                }
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={18} />
                                                Delete Account
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </header>

                {/* ==================== PAGE CONTENT ==================== */}

                <main className="p-5 sm:p-7 lg:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default RecruiterLayout;