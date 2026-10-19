import { useCallback, useEffect, useState } from "react";
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
    const [user, setUser] = useState(readStoredUser);
    const [profile, setProfile] = useState(null);

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
        refreshProfile();
        const refreshAfterProfileUpdate = () => refreshProfile();
        window.addEventListener("jobbridge:profile-updated", refreshAfterProfileUpdate);

        return () => {
            window.removeEventListener("jobbridge:profile-updated", refreshAfterProfileUpdate);
        };
    }, [refreshProfile]);

    return {
        user: profile?.user || user,
        profile,
    };
};

export default useRoleHeaderData;
