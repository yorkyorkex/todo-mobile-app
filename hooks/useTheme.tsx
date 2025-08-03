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
  priority: {
    urgent: string;
    high: string;
    medium: string;
    low: string;
  };
  categories: {
    work: string;
    personal: string;
    health: string;
    learning: string;
    shopping: string;
    travel: string;
  };
  gradients: {
    background: [string, string];
    surface: [string, string];
    primary: [string, string];
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
    urgent: [string, string];
    high: [string, string];
    medium: [string, string];
    low: [string, string];
    work: [string, string];
    personal: [string, string];
    health: [string, string];
    learning: [string, string];
    shopping: [string, string];
    travel: [string, string];
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
  priority: {
    urgent: "#dc2626",
    high: "#ea580c",
    medium: "#6366f1",
    low: "#10b981",
  },
  categories: {
    work: "#6366f1",
    personal: "#8b5cf6",
    health: "#10b981",
    learning: "#0891b2",
    shopping: "#ea580c",
    travel: "#e11d48",
  },
  gradients: {
    background: ["#fafbff", "#f1f5f9"],
    surface: ["#ffffff", "#fafbff"],
    primary: ["#8b5cf6", "#6366f1"],
    success: ["#10b981", "#059669"],
    warning: ["#f97316", "#ea580c"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#e2e8f0", "#cbd5e1"],
    empty: ["#f8fafc", "#f1f5f9"],
    urgent: ["#dc2626", "#b91c1c"],
    high: ["#ea580c", "#c2410c"],
    medium: ["#6366f1", "#4f46e5"],
    low: ["#10b981", "#059669"],
    work: ["#6366f1", "#4f46e5"],
    personal: ["#8b5cf6", "#7c3aed"],
    health: ["#10b981", "#059669"],
    learning: ["#0891b2", "#0e7490"],
    shopping: ["#ea580c", "#c2410c"],
    travel: ["#e11d48", "#be185d"],
  },
  backgrounds: {
    input: "#ffffff",
    editInput: "#ffffff",
  },
  statusBarStyle: "dark-content" as const,
};

const darkColors: ColorScheme = {
  bg: "#0d0d0d",
  surface: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#9ca3af",
  border: "#2d2d2d",
  primary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: "#000000",
  priority: {
    urgent: "#ef4444",
    high: "#f59e0b",
    medium: "#8b5cf6",
    low: "#10b981",
  },
  categories: {
    work: "#6366f1",
    personal: "#8b5cf6",
    health: "#10b981",
    learning: "#06b6d4",
    shopping: "#f59e0b",
    travel: "#f43f5e",
  },
  gradients: {
    background: ["#0d0d0d", "#1a1a1a"],
    surface: ["#1a1a1a", "#262626"],
    primary: ["#a855f7", "#6366f1"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#374151", "#4b5563"],
    empty: ["#1f2937", "#374151"],
    urgent: ["#ef4444", "#b91c1c"],
    high: ["#f59e0b", "#d97706"],
    medium: ["#8b5cf6", "#6366f1"],
    low: ["#10b981", "#059669"],
    work: ["#6366f1", "#4f46e5"],
    personal: ["#8b5cf6", "#7c3aed"],
    health: ["#10b981", "#059669"],
    learning: ["#06b6d4", "#0891b2"],
    shopping: ["#f59e0b", "#d97706"],
    travel: ["#f43f5e", "#e11d48"],
  },
  backgrounds: {
    input: "#1a1a1a",
    editInput: "#0d0d0d",
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

  // Ensure colors is always available
  if (!context.colors) {
    return {
      ...context,
      colors: lightColors, // Fallback to light colors
    };
  }

  return context;
};

export default useTheme