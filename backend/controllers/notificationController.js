import {
    deleteAllNotifications,
    deleteNotification,
    getMyNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
} from "../services/notificationService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

// GET /api/notifications
const getNotifications = asyncHandler(
    async (req, res) => {
        const notifications =
            await getMyNotifications(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                notifications,
            },
        });
    }
);

// GET /api/notifications/unread-count
const unreadCount = asyncHandler(
    async (req, res) => {
        const count =
            await getUnreadCount(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                unreadCount: count,
            },
        });
    }
);

// PATCH /api/notifications/:id/read
const markRead = asyncHandler(
    async (req, res) => {
        const notification =
            await markAsRead(
                req.user.id,
                req.params.id
            );
        res.status(200).json({
            success: true,
            message:MESSAGES.NOTIFICATIONS_MARKED_READ,
            data: {
                notification,
            },
        });
    }
);


// PATCH /api/notifications/read-all
const markAllRead = asyncHandler(
    async (req, res) => {
        await markAllAsRead(
            req.user.id
        );
        res.status(200).json({
            success: true,
            message:MESSAGES.NOTIFICATIONS_ALL_MARKED_READ,
        });
    }
);

// DELETE /api/notifications/:id
const removeNotification = asyncHandler(
    async (req, res) => {
        await deleteNotification(
            req.user.id,
            req.params.id
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message:MESSAGES.NOTIFICATIONS_DELETED,
        });
    }
);

// DELETE /api/notifications
const removeAllNotifications =
    asyncHandler(
        async (req, res) => {
            await deleteAllNotifications(
                req.user.id
            );
            res.status(STATUS_CODES.OK).json({
                success: true,
                message:MESSAGES.NOTIFICATIONS_ALL_DELETED,
        });
    }
);

export {
    getNotifications, markAllRead, markRead, removeAllNotifications, removeNotification, unreadCount
};
