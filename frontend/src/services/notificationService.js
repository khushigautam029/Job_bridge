import api from "./api";

export const getNotifications = async () =>
    (await api.get("/notifications")).data.data.notifications;

export const getUnreadNotificationCount = async () =>
    (await api.get("/notifications/unread-count"))
        .data.data.unreadCount;

export const markNotificationRead = async (notificationId) =>
    api.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = async () =>
    api.patch("/notifications/read-all");

export const deleteNotification = async (notificationId) =>
    api.delete(`/notifications/${notificationId}`);