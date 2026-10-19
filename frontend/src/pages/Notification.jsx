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
import {
    deleteNotification as deleteNotificationRequest,
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "../services/notificationService";

const NotificationDropdown = ({ onOpen, closeSignal = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [notifications, setNotifications] = useState([]);

    const dropdownRef = useRef(null);
    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    useEffect(() => {
        let active = true;
        const loadNotifications = async (showLoader = false) => {
            if (showLoader) setLoading(true);
            try {
                const items = await getNotifications();
                if (active) {
                    setNotifications(items.map((item) => ({
                        ...item,
                        read: item.isRead,
                        time: item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : "",
                    })));
                    setError("");
                }
            } catch (loadError) {
                if (active) {
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load notifications."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadNotifications(true);
        const refreshTimer = window.setInterval(() => loadNotifications(), 30000);
        const refreshOnFocus = () => loadNotifications();
        window.addEventListener("focus", refreshOnFocus);

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
            active = false;
            window.clearInterval(refreshTimer);
            window.removeEventListener("focus", refreshOnFocus);
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    useEffect(() => {
        if (closeSignal) setIsOpen(false);
    }, [closeSignal]);

    const markAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setError("");
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to mark this notification as read."
            );
            return;
        }
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

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsRead();
            setError("");
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to mark notifications as read."
            );
            return;
        }
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const deleteNotification = async (id) => {
        try {
            await deleteNotificationRequest(id);
            setError("");
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to delete this notification."
            );
            return;
        }
        setNotifications((prev) =>
            prev.filter(
                (notification) => notification.id !== id
            )
        );
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
                onClick={() => setIsOpen((prev) => {
                    const next = !prev;
                    if (next) onOpen?.();
                    return next;
                })}
                className="relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                title="Notifications"
            >
                <Bell size={20} />

                {/* Dynamic unread badge */}
                {!loading && unreadCount > 0 && (
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
                                    ? `${unreadCount} unread notification${unreadCount > 1
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
                        {loading ? (
                            <p className="px-4 py-8 text-center text-sm text-slate-500">
                                Loading notifications...
                            </p>
                        ) : error ? (
                            <p className="px-4 py-8 text-center text-sm text-red-600">
                                {error}
                            </p>
                        ) : notifications.length > 0 ? (
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

                                            ${!notification.read
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
                                                        ${!notification.read
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
