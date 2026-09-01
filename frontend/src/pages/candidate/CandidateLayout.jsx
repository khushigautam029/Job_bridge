
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
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const CandidateLayout = () => {
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userName = storedUser?.name || "Candidate";
    const userRole = storedUser?.role || "CANDIDATE";

    // =====================================================
    // CANDIDATE NAVIGATION
    // =====================================================

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

    // =====================================================
    // CLOSE MENUS
    // =====================================================

    const closeMenus = () => {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
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

    const handleProfileClick = () => {
        closeMenus();

        navigate("/candidate/profile");
    };

    // =====================================================
    // SETTINGS
    // =====================================================

    const handleSettingsClick = () => {
        closeMenus();

        navigate("/candidate/settings");
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
                        onClick={() => navigate("/candidate/jobs")}
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

                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    end={
                                        item.path ===
                                        "/candidate/jobs"
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

                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div className="flex items-center gap-2">

                        {/* ================= NOTIFICATIONS ================= */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/candidate/notifications"
                                )
                            }
                            className="relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                            title="Notifications"
                        >
                            <Bell size={20} />

                            {/* Notification Count */}

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
                                        {userRole === "RECRUITER"
                                            ? "Recruiter"
                                            : "Candidate"}
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
                                                    Candidate
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ================= OPTIONS ================= */}

                                    <div className="p-1.5">

                                        {/* My Profile */}

                                        <button
                                            type="button"
                                            onClick={
                                                handleProfileClick
                                            }
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <UserCircle size={18} />

                                            My Profile
                                        </button>

                                        {/* Settings */}

                                        <button
                                            type="button"
                                            onClick={
                                                handleSettingsClick
                                            }
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

                        <nav className="mx-auto max-w-[1440px] px-5 py-3 sm:px-7 lg:px-10">

                            <div className="space-y-1">

                                {navigation.map((item) => {

                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.title}
                                            to={item.path}
                                            end={
                                                item.path ===
                                                "/candidate/jobs"
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

                                {/* ================= NOTIFICATIONS ================= */}

                                <NavLink
                                    to="/candidate/notifications"
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

                                    <Bell size={18} />

                                    Notifications

                                </NavLink>

                            </div>

                        </nav>

                    </div>

                )}

            </header>

            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}

            <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-7 lg:px-10">

                <section>
                    <Outlet />
                </section>

            </main>

        </div>
    );
};

export default CandidateLayout;
