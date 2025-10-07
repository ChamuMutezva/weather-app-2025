import React, { useMemo, useState, useEffect, useCallback, type ReactNode } from "react";
import { ThemeContext, THEME_STORAGE_KEY, type ThemeContextType } from "./ThemeContext";

export interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize state from localStorage or default to system preference
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
            return savedTheme === "dark";
        }
        // Fallback to system preference if no saved theme is found
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem(THEME_STORAGE_KEY, newMode ? "dark" : "light");
            return newMode;
        });
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo((): ThemeContextType => ({
        isDarkMode,
        toggleDarkMode,
    }), [isDarkMode, toggleDarkMode]);


    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};
