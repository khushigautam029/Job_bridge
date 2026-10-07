import api from "./api";

const getData = (response) => response.data.data;

export const getCurrentUser = async () =>
    getData(await api.get("/users/me"));

export const updateCurrentUser = async (profile) =>
    getData(
        await api.put("/users/profile", profile)
    );

export const changePassword = async (passwords) =>
    api.put("/users/change-password", passwords);

export const deleteAccount = async () =>
    api.delete("/users/account");