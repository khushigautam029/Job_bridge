import { Notification } from "../models/index.js";

const createNotification = async ({
    userId,
    title,
    message,
    type = "SYSTEM",
}) => {
    const notification = await Notification.create({
        userId,
        title,
        message,
        type,
    });
    return notification;
};

export default createNotification;