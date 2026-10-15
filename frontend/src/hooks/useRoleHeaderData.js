import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
} from "../services/notificationService";
import {
    getCandidateProfile,
    getRecruiterProfile,
} from "../services/profileService";
import { getCurrentUser } from "../services/userService";

const readStoredUser = () => {
    try {
        return JSON.parse(
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            "null"
        );
    } catch {
        return null;
    }
};

const useRoleHeaderData = (role) => {
    const { pathname } = useLocation();
    const [user, setUser] = useState(readStoredUser);
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshUnreadCount = useCallback(async () => {
        try {
            setUnreadCount(await getUnreadNotificationCount());
        } catch {
            // Keep the last known count when the API is temporarily unavailable.
        }
    }, []);

    const refreshNotifications = useCallback(async () => {
        const items = await getNotifications();
        setNotifications(items);
        await refreshUnreadCount();
    }, [refreshUnreadCount]);

    const refreshProfile = useCallback(async () => {
        const profileRequest = role === "RECRUITER"
            ? getRecruiterProfile()
            : getCandidateProfile();
        const [userResult, profileResult] = await Promise.allSettled([
            getCurrentUser(),
            profileRequest,
        ]);
        if (userResult.status === "fulfilled") {
            setUser(userResult.value?.user || userResult.value || readStoredUser());
        }
        if (profileResult.status === "fulfilled") {
            const data = profileResult.value?.data;
            setProfile(role === "RECRUITER" ? data?.recruiter : data?.candidate);
        }
    }, [role]);

    useEffect(() => {
        let active = true;
        refreshProfile();

        refreshUnreadCount();
        const refreshTimer = window.setInterval(refreshUnreadCount, 30000);
        const refreshOnFocus = () => refreshUnreadCount();
        const refreshAfterProfileUpdate = () => refreshProfile();
        window.addEventListener("focus", refreshOnFocus);
        window.addEventListener("jobbridge:profile-updated", refreshAfterProfileUpdate);

        return () => {
            active = false;
            window.clearInterval(refreshTimer);
            window.removeEventListener("focus", refreshOnFocus);
            window.removeEventListener("jobbridge:profile-updated", refreshAfterProfileUpdate);
        };
    }, [role, pathname, refreshProfile, refreshUnreadCount]);

    const markAsRead = async (id) => {
        await markNotificationRead(id);
        setNotifications((items) => items.map((item) =>
            item.id === id ? { ...item, isRead: true } : item
        ));
        await refreshUnreadCount();
    };

    const markAllAsRead = async () => {
        await markAllNotificationsRead();
        setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
    };

    return {
        user: profile?.user || user,
        profile,
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
    };
};

export default useRoleHeaderData;
