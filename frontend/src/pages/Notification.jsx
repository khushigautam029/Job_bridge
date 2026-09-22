import {
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    CheckCircle2,
    FileText,
    Trash2,
    UserPlus,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const candidateNotifications = [
    {
        id: 1,
        type: "APPLICATION",
        title: "Application submitted",
        message: "Your application for Frontend Developer was submitted successfully.",
        time: "10 minutes ago",
        read: false,
    },
    {
        id: 2,
        type: "INTERVIEW",
        title: "Interview scheduled",
        message: "Your interview for React Developer is scheduled for tomorrow.",
        time: "1 hour ago",
        read: false,
    },
    {
        id: 3,
        type: "JOB",
        title: "New job recommendation",
        message: "A new React Developer position matches your profile.",
        time: "3 hours ago",
        read: true,
    },
];

const recruiterNotifications = [
    {
        id: 1,
        type: "APPLICATION",
        title: "New application received",
        message: "A candidate applied for your Frontend Developer position.",
        time: "15 minutes ago",
        read: false,
    },
    {
        id: 2,
        type: "INTERVIEW",
        title: "Interview reminder",
        message: "You have an interview scheduled for tomorrow.",
        time: "2 hours ago",
        read: false,
    },
    {
        id: 3,
        type: "JOB",
        title: "Job performance update",
        message: "Your job listing received 25 new views today.",
        time: "5 hours ago",
        read: true,
    },
];

const NotificationDropdown = ({ role = "CANDIDATE" }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [notifications, setNotifications] = useState(
        role === "RECRUITER"
            ? recruiterNotifications
            : candidateNotifications
    );

    const dropdownRef = useRef(null);

    /*
     * IMPORTANT:
     * unreadCount is calculated from notifications.
     *
     * This means the number automatically changes whenever
     * notifications are added, read, or deleted.
     */
    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    /*
     * Close dropdown when clicking outside
     */
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    /*
     * Mark one notification as read
     *
     * Because notifications state changes,
     * unreadCount automatically decreases by 1.
     */
    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? {
                          ...notification,
                          read: true,
                      }
                    : notification
            )
        );
    };

    /*
     * Mark all notifications as read
     *
     * unreadCount automatically becomes 0.
     */
    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    /*
     * Delete notification
     *
     * If the deleted notification was unread,
     * unreadCount automatically decreases.
     *
     * If it was already read,
     * unreadCount remains unchanged.
     */
    const deleteNotification = (id) => {
        setNotifications((prev) =>
            prev.filter(
                (notification) => notification.id !== id
            )
        );
    };

    /*
     * Add a new notification.
     *
     * This function can later be replaced by API/socket data.
     */
    const addNotification = (notification) => {
        setNotifications((prev) => [
            {
                id: Date.now(),
                read: false,
                ...notification,
            },
            ...prev,
        ]);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "APPLICATION":
                return <FileText size={17} />;

            case "INTERVIEW":
                return <CalendarDays size={17} />;

            case "JOB":
                return <BriefcaseBusiness size={17} />;

            case "PROFILE":
                return <UserPlus size={17} />;

            case "SUCCESS":
                return <CheckCircle2 size={17} />;

            default:
                return <Bell size={17} />;
        }
    };

    const getIconStyle = (type) => {
        switch (type) {
            case "APPLICATION":
                return "bg-blue-100 text-blue-600";

            case "INTERVIEW":
                return "bg-purple-100 text-purple-600";

            case "JOB":
                return "bg-indigo-100 text-indigo-600";

            case "PROFILE":
                return "bg-green-100 text-green-600";

            case "SUCCESS":
                return "bg-emerald-100 text-emerald-600";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="relative"
        >
            {/* Bell */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                title="Notifications"
            >
                <Bell size={20} />

                {/* Dynamic unread badge */}
                {unreadCount > 0 && (
                    <span
                        className="
                            absolute
                            -right-1
                            -top-1
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500
                            px-1
                            text-[10px]
                            font-bold
                            text-white
                            ring-2
                            ring-white
                        "
                    >
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="
                        absolute
                        right-0
                        top-12
                        z-50
                        w-[360px]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-2xl
                    "
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Notifications
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-500">
                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${
                                          unreadCount > 1
                                              ? "s"
                                              : ""
                                      }`
                                    : "You're all caught up"}
                            </p>
                        </div>

                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="rounded-lg px-2 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
                                >
                                    Mark all read
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="max-h-[420px] overflow-y-auto">
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
                                        className={`
                                            group
                                            relative
                                            flex
                                            cursor-pointer
                                            gap-3
                                            border-b
                                            border-slate-100
                                            px-4
                                            py-3.5
                                            transition
                                            hover:bg-slate-50

                                            ${
                                                !notification.read
                                                    ? "bg-indigo-50/40"
                                                    : "bg-white"
                                            }
                                        `}
                                    >
                                        {/* Unread indicator */}
                                        {!notification.read && (
                                            <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600" />
                                        )}

                                        {/* Icon */}
                                        <div
                                            className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                ${getIconStyle(
                                                    notification.type
                                                )}
                                            `}
                                        >
                                            {getNotificationIcon(
                                                notification.type
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4
                                                    className={`
                                                        text-sm
                                                        ${
                                                            !notification.read
                                                                ? "font-bold text-slate-900"
                                                                : "font-medium text-slate-700"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        notification.title
                                                    }
                                                </h4>

                                                {/* Unread dot */}
                                                {!notification.read && (
                                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                                                )}
                                            </div>

                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            <p className="mt-1.5 text-[11px] text-slate-400">
                                                {
                                                    notification.time
                                                }
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 items-start gap-1 opacity-0 transition group-hover:opacity-100">
                                            {!notification.read && (
                                                <button
                                                    type="button"
                                                    onClick={(
                                                        event
                                                    ) => {
                                                        event.stopPropagation();
                                                        markAsRead(
                                                            notification.id
                                                        );
                                                    }}
                                                    className="rounded-md p-1.5 text-slate-400 hover:bg-green-50 hover:text-green-600"
                                                    title="Mark as read"
                                                >
                                                    <Check
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(
                                                    event
                                                ) => {
                                                    event.stopPropagation();
                                                    deleteNotification(
                                                        notification.id
                                                    );
                                                }}
                                                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2
                                                    size={
                                                        15
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <Bell size={22} />
                                </div>

                                <h4 className="text-sm font-semibold text-slate-700">
                                    No notifications
                                </h4>

                                <p className="mt-1 text-xs text-slate-400">
                                    You're all caught up!
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
