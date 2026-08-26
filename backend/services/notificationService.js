import { Notification } from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";

// Get all notifications for logged-in user
const getMyNotifications = async (userId) => {
    const notifications = await Notification.findAll({
        where: {
            userId,
        },
        order: [
            ["createdAt", "DESC"],
        ],
    });
    return notifications;
};

// Get unread notification count
const getUnreadCount = async (userId) => {
    const count = await Notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
    return count;
};

// Mark one notification as read
const markAsRead = async (
    userId,
    notificationId
) => {
    const notification =
        await Notification.findOne({
            where: {
                id: notificationId,
                userId,
            },
        });
    if (!notification) {
        const error = new Error(
            "Notification not found"
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    notification.isRead = true;
    await notification.save();
    return notification;
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
    await Notification.update(
        {
            isRead: true,
        },
        {
            where: {
                userId,
                isRead: false,
            },
        }
    );
};

// Delete one notification
const deleteNotification = async (
    userId,
    notificationId
) => {
    const notification =
        await Notification.findOne({
            where: {
                id: notificationId,
                userId,
            },
        });
    if (!notification) {
        const error = new Error(
            "Notification not found"
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    await notification.destroy();
};

// Delete all notifications
const deleteAllNotifications = async (
    userId
) => {

    await Notification.destroy({
        where: {
            userId,
        },
    });
};


export {
    deleteAllNotifications, deleteNotification, getMyNotifications,
    getUnreadCount, markAllAsRead, markAsRead
};
