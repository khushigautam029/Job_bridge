import {
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    User,
    UserCircle,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const RecruiterLayout = () => {
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    const userName = storedUser?.name || "Recruiter";
    const userEmail = storedUser?.email || "";

    /*
     * ============================
     * MAIN NAVIGATION
     * ============================
     *
     * These links are visible in the
     * main JobBridge navbar.
     */

    const mainNavigation = [
        {
            title: "Find Jobs",
            icon: BriefcaseBusiness,
            path: "/jobs",
        },
        {
            title: "Companies",
            icon: BriefcaseBusiness,
            path: "/companies",
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
    ];

    /*
     * ============================
     * RECRUITER DASHBOARD NAVIGATION
     * ============================
     */

    const dashboardNavigation = [
        {
            title: "Overview",
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

    /*
     * ============================
     * CLOSE MENUS
     * ============================
     */

    const closeMenus = () => {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
    };

    /*
     * ============================
     * LOGOUT
     * ============================
     */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        closeMenus();

        navigate("/login");
    };

    /*
     * ============================
     * PROFILE
     * ============================
     */

    const handleProfile = () => {
        closeMenus();
        navigate("/recruiter/profile");
    };

    /*
     * ============================
     * SETTINGS
     * ============================
     */

    const handleSettings = () => {
        closeMenus();
        navigate("/recruiter/settings");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* =========================================================
                NAVBAR
            ========================================================= */}

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">

                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:px-10">

                    {/* ================= LOGO ================= */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
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

                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}

                    <nav className="hidden items-center gap-1 lg:flex">

                        {mainNavigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
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

                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div className="flex items-center gap-2">

                        {/* ================= NOTIFICATIONS ================= */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/recruiter/notifications"
                                )
                            }
                            className="relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                            title="Notifications"
                        >
                            <Bell size={20} />

                            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                                3
                            </span>
                        </button>

                        {/* ================= PROFILE ================= */}

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

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <User size={18} />
                                </div>

                                <div className="hidden text-left md:block">

                                    <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                                        {userName}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Recruiter
                                    </p>

                                </div>

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

                                    {/* ================= USER INFO ================= */}

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

                                    {/* ================= OPTIONS ================= */}

                                    <div className="p-1.5">

                                        {/* Profile */}

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

                                    {/* ================= LOGOUT ================= */}

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

                        {/* ================= MOBILE MENU ================= */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    (prev) => !prev
                                )
                            }
                            className="rounded-lg p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                        >
                            {mobileMenuOpen ? (
                                <X size={21} />
                            ) : (
                                <Menu size={21} />
                            )}
                        </button>

                    </div>

                </div>

                {/* =========================================================
                    MOBILE NAVIGATION
                ========================================================= */}

                {mobileMenuOpen && (

                    <div className="border-t border-slate-100 bg-white lg:hidden">

                        <nav className="mx-auto max-w-[1440px] px-5 py-3">

                            {mainNavigation.map((item) => {

                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.title}
                                        to={item.path}
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

                        </nav>

                    </div>

                )}

            </header>

            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}

            <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-7 lg:px-10">

                {/* =====================================================
                    DASHBOARD HEADER
                ===================================================== */}

                <div className="mb-5">

                    <p className="text-sm font-medium text-indigo-600">
                        Recruiter Portal
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your jobs, candidates and hiring process.
                    </p>

                </div>

                {/* =====================================================
                    DASHBOARD NAVIGATION
                ===================================================== */}

                <div className="mb-6 border-b border-slate-200">

                    <nav className="flex gap-1 overflow-x-auto">

                        {dashboardNavigation.map((item) => {

                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    end={
                                        item.path ===
                                        "/recruiter/dashboard"
                                    }
                                    className={({ isActive }) =>
                                        `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                                            isActive
                                                ? "border-indigo-600 text-indigo-600"
                                                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                                        }`
                                    }
                                >

                                    <Icon size={17} />

                                    {item.title}

                                </NavLink>
                            );

                        })}

                    </nav>

                </div>

                {/* =====================================================
                    PAGE CONTENT
                ===================================================== */}

                <section>
                    <Outlet />
                </section>

            </main>

        </div>
    );
};

export default RecruiterLayout;