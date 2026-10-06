import {
    deleteAllNotifications,
    deleteNotification,
    getMyNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
} from "../services/notificationService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

// GET /api/notifications
const getNotifications = asyncHandler(
    async (req, res) => {
        const notifications =
            await getMyNotifications(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATIONS_FETCHED,
            {
                notifications,
            }
        );
    }
);

// GET /api/notifications/unread-count
const unreadCount = asyncHandler(
    async (req, res) => {
        const count =
            await getUnreadCount(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.UNREAD_COUNT_FETCHED,
            {
                unreadCount: count,
            }
        );
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

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATIONS_MARKED_READ,
            {
                notification,
            }
        );
    }
);

// PATCH /api/notifications/read-all
const markAllRead = asyncHandler(
    async (req, res) => {
        await markAllAsRead(
            req.user.id
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATIONS_ALL_MARKED_READ
        );
    }
);

// DELETE /api/notifications/:id
const removeNotification = asyncHandler(
    async (req, res) => {
        await deleteNotification(
            req.user.id,
            req.params.id
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATIONS_DELETED
        );
    }
);

// DELETE /api/notifications
const removeAllNotifications =
    asyncHandler(
        async (req, res) => {
            await deleteAllNotifications(
                req.user.id
            );

            return sendSuccess(
                res,
                STATUS_CODES.OK,
                MESSAGES.NOTIFICATIONS_ALL_DELETED
            );
        }
    );

export {
    getNotifications,
    markAllRead,
    markRead,
    removeAllNotifications,
    removeNotification,
    unreadCount
};
