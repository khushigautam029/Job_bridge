import api from "./api";

const getData = (response) => response.data.data;

export const getCurrentUser = async () =>
    getData(await api.get("/users/get"));

export const updateCurrentUser = async (profile) =>
    getData(
        await api.put("/users/profile", profile)
    );

export const changePassword = async (passwords) =>
    api.put("/users/change-password", passwords);

export const getUserPreferences = async () =>
    getData(await api.get("/users/preferences")).preferences;

export const saveUserPreferences = async (preferences) =>
    getData(await api.put("/users/preferences", preferences)).preferences;

export const deleteAccount = async () =>
    api.delete("/users/account");
