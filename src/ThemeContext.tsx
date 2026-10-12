import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "naijaintern_theme";


const getInitialTheme = (): Theme => {
  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming | undefined;

  // Preserve the selected theme on a page refresh
  if (navigation?.type === "reload") {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (saved === "light" || saved === "dark") {
      return saved;
    }
  }

  // New visit: always start in light mode
  return "light";
};



export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  sessionStorage.setItem(STORAGE_KEY, theme);
}, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}