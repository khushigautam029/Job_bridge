import api from "./api";

export const getCompanies = async () =>
    (await api.get("/companies")).data.data.companies;
