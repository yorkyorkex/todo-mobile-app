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
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  typography: {
    hero: { fontSize: number; fontWeight: string; lineHeight: number };
    h1: { fontSize: number; fontWeight: string; lineHeight: number };
    h2: { fontSize: number; fontWeight: string; lineHeight: number };
    h3: { fontSize: number; fontWeight: string; lineHeight: number };
    body: { fontSize: number; fontWeight: string; lineHeight: number };
    caption: { fontSize: number; fontWeight: string; lineHeight: number };
    small: { fontSize: number; fontWeight: string; lineHeight: number };
  };
  animation: {
    fast: number;
    normal: number;
    slow: number;
  };
  statusBarStyle: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#fafbff",
  surface: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: "#000000",
  priority: {
    urgent: "#ef4444",
    high: "#f59e0b",
    medium: "#6366f1",
    low: "#10b981",
  },
  categories: {
    work: "#6366f1",
    personal: "#8b5cf6",
    health: "#10b981",
    learning: "#0891b2",
    shopping: "#f59e0b",
    travel: "#e11d48",
  },
  gradients: {
    background: ["#fafbff", "#f8fafc"],
    surface: ["#ffffff", "#f8fafc"],
    primary: ["#8b5cf6", "#6366f1"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#f1f5f9", "#e2e8f0"],
    empty: ["#f8fafc", "#f1f5f9"],
    urgent: ["#ef4444", "#dc2626"],
    high: ["#f59e0b", "#d97706"],
    medium: ["#6366f1", "#4f46e5"],
    low: ["#10b981", "#059669"],
    work: ["#6366f1", "#4f46e5"],
    personal: ["#8b5cf6", "#7c3aed"],
    health: ["#10b981", "#059669"],
    learning: ["#0891b2", "#0e7490"],
    shopping: ["#f59e0b", "#d97706"],
    travel: ["#e11d48", "#be185d"],
  },
  backgrounds: {
    input: "#ffffff",
    editInput: "#f8fafc",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
  },
  shadows: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  typography: {
    hero: { fontSize: 32, fontWeight: '800', lineHeight: 38 },
    h1: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
    h2: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
    caption: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
    small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  },
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  statusBarStyle: "dark-content" as const,
};

const darkColors: ColorScheme = {
  bg: "#0d1117", // GitHub dark theme background
  surface: "#161b22", // Card background
  text: "#f0f6fc", // High contrast white text
  textMuted: "#7d8590", // Subtle gray text
  border: "#30363d", // Subtle borders
  primary: "#6c63ff", // Modern purple
  success: "#238636", // GitHub green
  warning: "#bf8700", // Warmer orange
  danger: "#f85149", // GitHub red
  shadow: "#000000",
  priority: {
    urgent: "#f85149", // Bright red
    high: "#ff9500", // Vibrant orange
    medium: "#6c63ff", // Modern purple
    low: "#238636", // Success green
  },
  categories: {
    work: "#6c63ff", // Modern purple
    personal: "#a855f7", // Bright purple
    health: "#238636", // Health green
    learning: "#0969da", // Learning blue
    shopping: "#ff9500", // Shopping orange
    travel: "#ec6cb9", // Travel pink
  },
  gradients: {
    background: ["#0d1117", "#161b22"],
    surface: ["#161b22", "#21262d"],
    primary: ["#6c63ff", "#9333ea"],
    success: ["#238636", "#2ea043"],
    warning: ["#bf8700", "#fb8500"],
    danger: ["#f85149", "#ff6b6b"],
    muted: ["#21262d", "#30363d"],
    empty: ["#161b22", "#21262d"],
    urgent: ["#f85149", "#ff6b6b"],
    high: ["#ff9500", "#ffa726"],
    medium: ["#6c63ff", "#9333ea"],
    low: ["#238636", "#2ea043"],
    work: ["#6c63ff", "#9333ea"],
    personal: ["#a855f7", "#c084fc"],
    health: ["#238636", "#2ea043"],
    learning: ["#0969da", "#1e88e5"],
    shopping: ["#ff9500", "#ffa726"],
    travel: ["#ec6cb9", "#f48fb1"],
  },
  backgrounds: {
    input: "#21262d",
    editInput: "#30363d",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
  },
  shadows: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  typography: {
    hero: { fontSize: 32, fontWeight: '800', lineHeight: 38 },
    h1: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
    h2: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
    caption: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
    small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  },
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
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