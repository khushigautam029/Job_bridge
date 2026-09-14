import {
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    CheckCircle2,
    FileText,
    Trash2,
    UserCheck,
    Users,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// CANDIDATE NOTIFICATIONS
const candidateNotifications = [
    {
        id: 1,
        type: "APPLICATION",
        title: "Application Submitted",
        message:
            "Your application for Senior React Developer at TechNova Solutions has been submitted successfully.",
        time: "10 min ago",
        read: false,
    },
    {
        id: 2,
        type: "STATUS",
        title: "Application Shortlisted",
        message:
            "Great news! Your application for Backend Developer at CloudCore Technologies has been shortlisted.",
        time: "2 hours ago",
        read: false,
    },
    {
        id: 3,
        type: "INTERVIEW",
        title: "Interview Scheduled",
        message:
            "Your interview for Senior React Developer has been scheduled for August 28 at 11:00 AM.",
        time: "5 hours ago",
        read: false,
    },
    {
        id: 4,
        type: "JOB",
        title: "New Job Recommendation",
        message:
            "A new MERN Stack Developer position matches your profile and skills.",
        time: "Yesterday",
        read: true,
    },
    {
        id: 5,
        type: "PROFILE",
        title: "Complete Your Profile",
        message:
            "Your candidate profile is 80% complete. Add your skills and portfolio to improve your profile.",
        time: "2 days ago",
        read: true,
    },
];

// =====================================================
// RECRUITER NOTIFICATIONS
// =====================================================

const recruiterNotifications = [
    {
        id: 101,
        type: "APPLICATION",
        title: "New Application Received",
        message:
            "Rahul Sharma has applied for your Senior React Developer position.",
        time: "15 min ago",
        read: false,
    },
    {
        id: 102,
        type: "APPLICATION",
        title: "New Application Received",
        message:
            "Khushi Gautam has applied for your MERN Stack Developer position.",
        time: "1 hour ago",
        read: false,
    },
    {
        id: 103,
        type: "INTERVIEW",
        title: "Interview Scheduled",
        message:
            "An interview has been scheduled with Rahul Sharma for Senior React Developer.",
        time: "3 hours ago",
        read: false,
    },
    {
        id: 104,
        type: "JOB",
        title: "Job Closing Soon",
        message:
            "Your Backend Developer job posting will reach its application deadline in 2 days.",
        time: "Yesterday",
        read: true,
    },
    {
        id: 105,
        type: "USER",
        title: "New Candidate Activity",
        message:
            "A candidate who applied to your job has updated their profile and resume.",
        time: "2 days ago",
        read: true,
    },
];

const NotificationDropdown = ({ role = "CANDIDATE" }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [notifications, setNotifications] = useState(() =>
        role === "RECRUITER"
            ? recruiterNotifications
            : candidateNotifications
    );

    const dropdownRef = useRef(null);

    // =====================================================
    // UNREAD COUNT
    // Used only to show the bell indicator.
    // =====================================================

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    // =====================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =====================================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
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
    // UPDATE NOTIFICATIONS WHEN ROLE CHANGES
    // =====================================================

    useEffect(() => {
        setNotifications(
            role === "RECRUITER"
                ? recruiterNotifications
                : candidateNotifications
        );

        setIsOpen(false);
    }, [role]);

    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? {
                          ...notification,
                          read: true,
                      }
                    : notification
            )
        );
    };

    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    const deleteNotification = (id) => {
        setNotifications((current) =>
            current.filter(
                (notification) => notification.id !== id
            )
        );
    };

    // =====================================================
    // GET NOTIFICATION ICON
    // =====================================================

    const getNotificationIcon = (type) => {
        switch (type) {
            case "APPLICATION":
                return <FileText size={17} />;

            case "INTERVIEW":
                return <CalendarDays size={17} />;

            case "JOB":
                return <BriefcaseBusiness size={17} />;

            case "PROFILE":
                return <UserCheck size={17} />;

            case "STATUS":
                return <CheckCircle2 size={17} />;

            case "USER":
                return <Users size={17} />;

            default:
                return <Bell size={17} />;
        }
    };

    // =====================================================
    // GET ICON STYLE
    // =====================================================

    const getIconStyle = (type) => {
        switch (type) {
            case "APPLICATION":
                return "bg-indigo-50 text-indigo-600";

            case "INTERVIEW":
                return "bg-purple-50 text-purple-600";

            case "JOB":
                return "bg-blue-50 text-blue-600";

            case "PROFILE":
                return "bg-amber-50 text-amber-600";

            case "STATUS":
                return "bg-green-50 text-green-600";

            case "USER":
                return "bg-cyan-50 text-cyan-600";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="relative"
        >
            {/* =================================================
                NOTIFICATION BUTTON
            ================================================= */}

            <button
                type="button"
                onClick={() =>
                    setIsOpen((current) => !current)
                }
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 ${
                    isOpen
                        ? "bg-slate-100 text-indigo-600"
                        : ""
                }`}
                aria-label="Notifications"
                aria-expanded={isOpen}
                title="Notifications"
            >
                <Bell size={21} />

                {/* Unread Indicator */}
                {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600" />
                )}
            </button>

            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                        <h3 className="text-sm font-bold text-slate-900">
                            Notifications
                        </h3>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Close notifications"
                            title="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* =================================================
                        NOTIFICATION LIST
                    ================================================= */}

                    <div className="max-h-[430px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(
                                (notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() =>
                                            markAsRead(
                                                notification.id
                                            )
                                        }
                                        className={`group relative flex cursor-pointer gap-3 border-b border-slate-100 px-4 py-3.5 transition last:border-b-0 ${
                                            notification.read
                                                ? "bg-white hover:bg-slate-50"
                                                : "bg-indigo-50/50 hover:bg-indigo-50"
                                        }`}
                                    >
                                        {/* =================================================
                                            UNREAD LEFT INDICATOR
                                        ================================================= */}

                                        {!notification.read && (
                                            <span className="absolute left-0 top-0 h-full w-0.5 bg-indigo-600" />
                                        )}

                                        {/* =================================================
                                            ICON
                                        ================================================= */}

                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getIconStyle(
                                                notification.type
                                            )}`}
                                        >
                                            {getNotificationIcon(
                                                notification.type
                                            )}
                                        </div>

                                        {/* =================================================
                                            CONTENT
                                        ================================================= */}

                                        <div className="min-w-0 flex-1 pr-5">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4
                                                    className={`text-xs ${
                                                        notification.read
                                                            ? "font-semibold text-slate-700"
                                                            : "font-bold text-slate-900"
                                                    }`}
                                                >
                                                    {
                                                        notification.title
                                                    }
                                                </h4>

                                                {!notification.read && (
                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                                                )}
                                            </div>

                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
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

                                        {/* =================================================
                                            DELETE BUTTON
                                        ================================================= */}

                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();

                                                deleteNotification(
                                                    notification.id
                                                );
                                            }}
                                            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-lg bg-white p-1.5 text-slate-300 shadow-sm transition hover:bg-red-50 hover:text-red-500 group-hover:block"
                                            title="Delete notification"
                                            aria-label="Delete notification"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        {/* =================================================
                                            MARK AS READ BUTTON
                                        ================================================= */}

                                        {!notification.read && (
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();

                                                    markAsRead(
                                                        notification.id
                                                    );
                                                }}
                                                className="absolute bottom-3 right-3 hidden rounded-lg bg-white p-1.5 text-slate-300 shadow-sm transition hover:bg-green-50 hover:text-green-600 group-hover:block"
                                                title="Mark as read"
                                                aria-label="Mark as read"
                                            >
                                                <Check size={13} />
                                            </button>
                                        )}
                                    </div>
                                )
                            )
                        ) : (
                            /* =================================================
                               EMPTY STATE
                            ================================================= */

                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <Bell size={22} />
                                </div>

                                <h4 className="mt-4 text-sm font-semibold text-slate-800">
                                    No notifications
                                </h4>

                                <p className="mt-1 text-xs text-slate-400">
                                    You're all caught up.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
