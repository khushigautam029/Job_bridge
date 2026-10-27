import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("jobbridge-theme") === "dark";
    });

    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            isDarkMode
        );

        localStorage.setItem(
            "jobbridge-theme",
            isDarkMode ? "dark" : "light"
        );
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((previous) => !previous);
    };

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
};
