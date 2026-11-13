import {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";

const STORAGE_KEY = "jobbridge-theme";
const VALID_THEMES = new Set(["light", "dark", "system"]);
const ThemeContext = createContext(null);

const readSavedTheme = () => {
    try {
        const savedTheme = window.localStorage.getItem(STORAGE_KEY);
        return VALID_THEMES.has(savedTheme) ? savedTheme : "system";
    } catch {
        return "system";
    }
};

const getSystemPreference = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches === true;

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(readSavedTheme);
    const [systemIsDark, setSystemIsDark] = useState(getSystemPreference);
    const isDarkMode = theme === "dark" || (theme === "system" && systemIsDark);

    useEffect(() => {
        const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
        if (!mediaQuery) return undefined;

        const handlePreferenceChange = (event) => setSystemIsDark(event.matches);
        mediaQuery.addEventListener?.("change", handlePreferenceChange);
        return () => mediaQuery.removeEventListener?.("change", handlePreferenceChange);
    }, []);

    useLayoutEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", isDarkMode);
        root.dataset.theme = theme;
        root.dataset.colorMode = isDarkMode ? "dark" : "light";
        root.style.colorScheme = isDarkMode ? "dark" : "light";

        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // The active theme still works when browser storage is unavailable.
        }
    }, [isDarkMode, theme]);

    const toggleTheme = () => {
        setTheme(isDarkMode ? "light" : "dark");
    };

    const value = useMemo(
        () => ({ theme, setTheme, isDarkMode, toggleTheme }),
        [theme, isDarkMode]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
};
