import api from "./api";

export const getSkills = async () =>
    (await api.get("/skills")).data.data.skills;