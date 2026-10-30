const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ASSET_BASE_URL = API_URL.replace(/\/api\/?$/, "");

const getAssetUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;

    return `${ASSET_BASE_URL}/${String(path)
        .replace(/^[\\/]+/, "")
        .replaceAll("\\", "/")}`;
};

export default getAssetUrl;
