import { Notification, User, UserPreference } from "../models/index.js";

const createNotification = async ({
    userId,
    title,
    message,
    type = "SYSTEM",
}) => {
    const preferences = await UserPreference.findOne({ where: { userId } });
    const notificationPreferences = preferences?.notificationSettings;
    const user = await User.findByPk(userId, { attributes: ["role"] });
    const preferenceMap = user?.role === "RECRUITER"
        ? { JOB: "newCandidateAlerts", APPLICATION: "applicationAlerts", INTERVIEW: "interviewUpdates" }
        : { JOB: "jobAlerts", APPLICATION: "applicationUpdates", INTERVIEW: "interviewReminders" };
    const preferenceKey = preferenceMap[type];

    if (preferenceKey && notificationPreferences?.[preferenceKey] === false) {
        return null;
    }

    const notification = await Notification.create({
        userId,
        title,
        message,
        type,
    });
    return notification;
};

export default createNotification;
