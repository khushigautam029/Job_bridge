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
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import useRoleHeaderData from "../../hooks/useRoleHeaderData";

const CandidateLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const notificationRef = useRef(null);
    const {
        user,
        profile,
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
    } = useRoleHeaderData("CANDIDATE");

    const userName = profile?.user?.name || user?.name || "Candidate";
    const userRole = user?.role || "CANDIDATE";
    const avatarUrl = profile?.profileImage || user?.candidateProfile?.profileImage;

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
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

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
        <div className="candidate-layout min-h-screen bg-slate-50 text-slate-800">
            <style>{`
                @keyframes candidateHeaderIn {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes candidatePageIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes candidateDropdownIn {
                    from { opacity: 0; transform: translateY(-7px) scale(.985); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes candidateLogoGlow {
                    0%, 100% { box-shadow: 0 4px 12px rgba(79, 70, 229, .16); }
                    50% { box-shadow: 0 5px 20px rgba(79, 70, 229, .34); }
                }
                @keyframes candidateBadgePulse {
                    0%, 100% { box-shadow: 0 0 0 2px white; }
                    50% { box-shadow: 0 0 0 3px white, 0 0 0 5px rgba(239, 68, 68, .12); }
                }
                @keyframes candidateShimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .candidate-header {
                    animation: candidateHeaderIn .55s cubic-bezier(.2,.75,.25,1) both;
                }
                .candidate-logo-mark {
                    animation: candidateLogoGlow 3.2s ease-in-out infinite;
                    transition: transform .28s ease, border-radius .28s ease;
                }
                .candidate-logo:hover .candidate-logo-mark {
                    transform: rotate(-7deg) scale(1.07);
                    border-radius: 13px;
                }
                .candidate-logo-word {
                    background: linear-gradient(100deg, #0f172a 10%, #4f46e5 45%, #0f172a 75%);
                    background-size: 220% auto;
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    transition: background-position .4s ease;
                }
                .candidate-logo:hover .candidate-logo-word { background-position: right center; }
                .candidate-nav-link { position: relative; overflow: hidden; transition: color .22s ease, background .22s ease, transform .22s ease; }
                .candidate-nav-link::after {
                    content: "";
                    position: absolute;
                    left: 13px;
                    right: 13px;
                    bottom: 4px;
                    height: 2px;
                    border-radius: 99px;
                    background:  #4f46e5;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform .24s ease;
                }
                .candidate-nav-link:hover { transform: translateY(-1px); }
                .candidate-nav-link:hover::after, .candidate-nav-link.is-active::after { transform: scaleX(1); }
                .candidate-nav-link.is-active::after { opacity: .75; }
                .candidate-icon-button { transition: transform .2s ease, background .2s ease, color .2s ease; }
                .candidate-icon-button:hover { transform: translateY(-2px); }
                .candidate-icon-button:active { transform: scale(.94); }
                .candidate-dropdown { transform-origin: top right; animation: candidateDropdownIn .2s cubic-bezier(.2,.8,.2,1) both; }
                .candidate-dropdown-item { transition: background .18s ease, transform .18s ease, padding-left .18s ease; }
                .candidate-dropdown-item:hover { transform: translateX(2px); }
                .candidate-avatar { transition: transform .25s ease, box-shadow .25s ease; }
                .candidate-profile-trigger:hover .candidate-avatar { transform: scale(1.07); box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
                .candidate-unread-badge { animation: candidateBadgePulse 2.2s ease-in-out infinite; }
                .candidate-mobile-menu { animation: candidateDropdownIn .22s ease-out both; transform-origin: top; }
                .candidate-page-content { animation: candidatePageIn .42s cubic-bezier(.2,.7,.2,1) both; }
                .candidate-layout button:focus-visible, .candidate-layout a:focus-visible {
                    outline: 3px solid rgba(99,102,241,.35);
                    outline-offset: 3px;
                }
                @media (prefers-reduced-motion: reduce) {
                    .candidate-layout *, .candidate-layout *::before, .candidate-layout *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            {/* HEADER */}

            <header className="candidate-header relative z-50 border-b border-slate-200 bg-white-50">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-8">
                    {/* LOGO */}
                    <button
                        type="button"
                        onClick={() => navigate("/", { replace: true })}
                        className="candidate-logo flex shrink-0 items-center gap-2"
                    >
                        <div className="candidate-logo-mark flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="candidate-logo-word text-lg font-bold tracking-tight">
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
                                        `candidate-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${isActive
                                            ? "is-active  bg-blue-50 text-indigo-700"
                                            : " text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        
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
                                onClick={async () => {
                                    const opening = !notificationOpen;
                                    setNotificationOpen(opening);
                                    setProfileMenuOpen(false);
                                    if (opening) await refreshNotifications().catch(() => {});
                                }}
                                className={`candidate-icon-button relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 ${notificationOpen
                                        ? "bg-slate-100 text-indigo-600"
                                        : ""
                                    }`}
                                title="Notifications"
                                aria-label="Notifications"
                            >
                                <Bell size={19} />

                                {unreadCount > 0 && (
                                    <span className="candidate-unread-badge absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* NOTIFICATION DROPDOWN */}
                            {notificationOpen && (
                                <div className="candidate-dropdown absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

                                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                        <h3 className="text-sm font-bold text-slate-900">
                                            Notifications
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && <button type="button" onClick={() => markAllAsRead().catch(() => {})} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Mark all read</button>}
                                            <button type="button" onClick={() => setNotificationOpen(false)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close notifications"><X size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="max-h-[420px] overflow-y-auto">
                                        {notifications.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p> : notifications.slice(0, 6).map((notification) => (
                                            <button key={notification.id} type="button" onClick={async () => { if (!notification.isRead) await markAsRead(notification.id).catch(() => {}); setNotificationOpen(false); navigate("/candidate/notifications"); }} className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${notification.isRead ? "" : "bg-indigo-50/50"}`}>
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Bell size={17} /></span>
                                                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800">{notification.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{notification.message}</span><span className="mt-1.5 block text-[10px] font-medium text-slate-400">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}</span></span>
                                            </button>
                                        ))}
                                    </div>
                                    {/* <button type="button" onClick={() => { setNotificationOpen(false); navigate("/candidate/notifications"); }} className="w-full border-t border-slate-100 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-slate-50">View all notifications</button> */}
                                </div>
                            )}
                        </div>

                        {/* PROFILE */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileMenuOpen((previous) => {
                                        setNotificationOpen(false);
                                        return !previous;
                                    })
                                }
                                className={`candidate-profile-trigger flex items-center gap-2 rounded-lg px-2 py-1.5 transition ${profileMenuOpen
                                        ? "bg-slate-100"
                                        : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="candidate-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600">
                                    {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : <User size={17} />}
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
                                <div className="candidate-dropdown absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">

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
                                            className="candidate-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <UserCircle size={17} />
                                            View and Update profile
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSettingsClick}
                                            className="candidate-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Settings size={17} />
                                            Settings
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-100 p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="candidate-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
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
                            className="candidate-icon-button rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
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
                    <div className="candidate-mobile-menu border-t border-slate-100 bg-white lg:hidden">
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
                <section key={location.pathname} className="candidate-page-content">
                    <Outlet />
                </section>
            </main>

        </div>
    );
};

export default CandidateLayout;
