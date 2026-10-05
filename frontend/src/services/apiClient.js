import axios from "axios";

const apiClient = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api",
    headers: {
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;
