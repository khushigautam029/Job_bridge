import express from "express";
import {
    getNotifications,
    markAllRead,
    markRead,
    removeAllNotifications,
    removeNotification,
    unreadCount,
} from "../controllers/notificationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications
router.get( "/", protect, getNotifications);
// Get unread count
router.get( "/unread-count", protect, unreadCount);
// Mark all as read
router.patch( "/read-all", protect, markAllRead);
// Mark one as read
router.patch( "/:id/read", protect, markRead);
// Delete all
router.delete( "/", protect, removeAllNotifications);
// Delete one
router.delete( "/:id", protect, removeNotification);

export default router;