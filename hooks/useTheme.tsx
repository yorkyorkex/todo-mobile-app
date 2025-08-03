import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, useContext, useEffect, useState } from 'react';

export interface ColorScheme {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  gradients: {
    background: [string, string];
    surface: [string, string];
    primary: [string, string];
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
  };
  backgrounds: {
    input: string;
    editInput: string;
  };
  statusBarStyle: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#fafbff",
  surface: "#ffffff",
  text: "#0f172a",
  textMuted: "#475569",
  border: "#e1e7ef",
  primary: "#6366f1",
  success: "#059669",
  warning: "#ea580c",
  danger: "#dc2626",
  shadow: "#000000",
  gradients: {
    background: ["#fafbff", "#f1f5f9"],
    surface: ["#ffffff", "#fafbff"],
    primary: ["#8b5cf6", "#6366f1"],
    success: ["#10b981", "#059669"],
    warning: ["#f97316", "#ea580c"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#e2e8f0", "#cbd5e1"],
    empty: ["#f8fafc", "#f1f5f9"],
  },
  backgrounds: {
    input: "#ffffff",
    editInput: "#ffffff",
  },
  statusBarStyle: "dark-content" as const,
};

const darkColors: ColorScheme = {
  bg: "#0a0a0a",
  surface: "#1a1a1a",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  border: "#2a2a2a",
  primary: "#8b5cf6",
  success: "#22c55e",
  warning: "#f97316",
  danger: "#ef4444",
  shadow: "#000000",
  gradients: {
    background: ["#0a0a0a", "#1a1a1a"],
    surface: ["#1a1a1a", "#2a2a2a"],
    primary: ["#a855f7", "#8b5cf6"],
    success: ["#22c55e", "#16a34a"],
    warning: ["#f97316", "#ea580c"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#404040", "#525252"],
    empty: ["#262626", "#404040"],
  },
  backgrounds: {
    input: "#1a1a1a",
    editInput: "#0a0a0a",
  },
  statusBarStyle: "light-content" as const,
};

interface ThemeContextType {
    colors: ColorScheme;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // get the user's choice
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value) setIsDarkMode(JSON.parse(value));
    });
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default useTheme