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
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import useRoleHeaderData from "../../hooks/useRoleHeaderData";

const RecruiterLayout = () => {
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
    } = useRoleHeaderData("RECRUITER");

    const userName = profile?.user?.name || user?.name || "Recruiter";
    const userEmail = profile?.user?.email || user?.email || "";
    const avatarUrl = profile?.company?.logo || user?.recruiterProfile?.company?.logo;

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

    // RECRUITER NAVIGATION
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
    const handleProfile = () => {
        closeMenus();

        navigate("/recruiter/profile");
    };

    // SETTINGS
    const handleSettings = () => {
        closeMenus();

        navigate("/recruiter/settings");
    };

    return (
        <div className="recruiter-layout min-h-screen bg-slate-50 text-slate-800">
            <style>{`
                @keyframes recruiterHeaderIn {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes recruiterPageIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes recruiterDropdownIn {
                    from { opacity: 0; transform: translateY(-7px) scale(.985); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes recruiterLogoGlow {
                    0%, 100% { box-shadow: 0 4px 12px rgba(79, 70, 229, .16); }
                    50% { box-shadow: 0 5px 20px rgba(79, 70, 229, .34); }
                }
                @keyframes recruiterBadgePulse {
                    0%, 100% { box-shadow: 0 0 0 2px white; }
                    50% { box-shadow: 0 0 0 3px white, 0 0 0 5px rgba(239, 68, 68, .12); }
                }
                @keyframes recruiterShimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .recruiter-header {
                    animation: recruiterHeaderIn .55s cubic-bezier(.2,.75,.25,1) both;
                }
                .recruiter-logo-mark {
                    animation: recruiterLogoGlow 3.2s ease-in-out infinite;
                    transition: transform .28s ease, border-radius .28s ease;
                }
                .recruiter-logo:hover .recruiter-logo-mark {
                    transform: rotate(-7deg) scale(1.07);
                    border-radius: 13px;
                }
                .recruiter-logo-word {
                    background: linear-gradient(100deg, #0f172a 10%, #4f46e5 45%, #0f172a 75%);
                    background-size: 220% auto;
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    transition: background-position .4s ease;
                }
                .recruiter-logo:hover .recruiter-logo-word { background-position: right center; }
                .recruiter-nav-link { position: relative; overflow: hidden; transition: color .22s ease, background .22s ease, transform .22s ease; }
                .recruiter-nav-link::after {
                    content: "";
                    position: absolute;
                    left: 13px;
                    right: 13px;
                    bottom: 4px;
                    height: 2px;
                    border-radius: 99px;
                    background: #6366f1;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform .24s ease;
                }
                .recruiter-nav-link:hover { transform: translateY(-1px); }
                .recruiter-nav-link:hover::after, .recruiter-nav-link.is-active::after { transform: scaleX(1); }
                .recruiter-nav-link.is-active::after { opacity: .75; }
                .recruiter-icon-button { transition: transform .2s ease, background .2s ease, color .2s ease; }
                .recruiter-icon-button:hover { transform: translateY(-2px); }
                .recruiter-icon-button:active { transform: scale(.94); }
                .recruiter-dropdown { transform-origin: top right; animation: recruiterDropdownIn .2s cubic-bezier(.2,.8,.2,1) both; }
                .recruiter-dropdown-item { transition: background .18s ease, transform .18s ease, padding-left .18s ease; }
                .recruiter-dropdown-item:hover { transform: translateX(2px); }
                .recruiter-avatar { transition: transform .25s ease, box-shadow .25s ease; }
                .recruiter-profile-trigger:hover .recruiter-avatar { transform: scale(1.07); box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
                .recruiter-unread-badge { animation: recruiterBadgePulse 2.2s ease-in-out infinite; }
                .recruiter-mobile-menu { animation: recruiterDropdownIn .22s ease-out both; transform-origin: top; }
                .recruiter-page-content { animation: recruiterPageIn .42s cubic-bezier(.2,.7,.2,1) both; }
                .recruiter-layout button:focus-visible, .recruiter-layout a:focus-visible {
                    outline: 3px solid rgba(99,102,241,.35);
                    outline-offset: 3px;
                }
                @media (prefers-reduced-motion: reduce) {
                    .recruiter-layout *, .recruiter-layout *::before, .recruiter-layout *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            {/* HEADER */}

            <header className="recruiter-header sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-8">
                    {/* LOGO */}
                    <button
                        type="button"
                        onClick={() => navigate("/", { replace: true })}
                        className="recruiter-logo flex shrink-0 items-center gap-2"
                    >
                        <div className="recruiter-logo-mark flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="recruiter-logo-word text-lg font-bold tracking-tight">
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
                                    end={item.path === "/recruiter/jobs"}
                                    className={({ isActive }) =>
                                        `recruiter-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${isActive
                                            ? "is-active bg-indigo-50 text-indigo-600"
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
                                onClick={async () => {
                                    const opening = !notificationOpen;
                                    setNotificationOpen(opening);
                                    if (opening) await refreshNotifications().catch(() => {});
                                }}
                                className={`recruiter-icon-button relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 ${notificationOpen
                                        ? "bg-slate-100 text-indigo-600"
                                        : ""
                                    }`}
                                title="Notifications"
                                aria-label="Notifications"
                            >
                                <Bell size={19} />

                                {unreadCount > 0 && (
                                    <span className="recruiter-unread-badge absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* NOTIFICATION DROPDOWN */}
                            {notificationOpen && (
                                <div className="recruiter-dropdown absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

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
                                            <button key={notification.id} type="button" onClick={async () => { if (!notification.isRead) await markAsRead(notification.id).catch(() => {}); setNotificationOpen(false); navigate("/recruiter/notifications"); }} className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${notification.isRead ? "" : "bg-indigo-50/50"}`}>
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Bell size={17} /></span>
                                                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800">{notification.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{notification.message}</span><span className="mt-1.5 block text-[10px] font-medium text-slate-400">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}</span></span>
                                            </button>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => { setNotificationOpen(false); navigate("/recruiter/notifications"); }} className="w-full border-t border-slate-100 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-slate-50">View all notifications</button>
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
                                className={`recruiter-profile-trigger flex items-center gap-2 rounded-lg px-2 py-1.5 transition ${profileMenuOpen
                                        ? "bg-slate-100"
                                        : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="recruiter-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600">
                                    {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : <User size={17} />}
                                </div>

                                <div className="hidden text-left sm:block">
                                    <p className="max-w-[120px] truncate text-sm font-semibold leading-4 text-slate-800">
                                        {userName}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Recruiter
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
                                <div className="recruiter-dropdown absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">

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
                                                    {userEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleProfile}
                                            className="recruiter-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <UserCircle size={17} />
                                            View and Update profile
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSettings}
                                            className="recruiter-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Settings size={17} />
                                            Settings
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-100 p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="recruiter-dropdown-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
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
                            className="recruiter-icon-button rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
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
                    <div className="recruiter-mobile-menu border-t border-slate-100 bg-white lg:hidden">
                        <nav className="mx-auto max-w-[1400px] px-5 py-3 sm:px-7 lg:px-8">
                            <div className="space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.title}
                                            to={item.path}
                                            end={item.path === "/recruiter/jobs"}
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
                <section key={location.pathname} className="recruiter-page-content">
                    <Outlet />
                </section>
            </main>

        </div>
    );
};

export default RecruiterLayout;
