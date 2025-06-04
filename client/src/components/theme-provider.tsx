import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "ocean-depths" | "warm-earth" | "solarized";
type Mode = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const initialState: ThemeProviderState = {
  theme: "ocean-depths",
  mode: "light",
  setTheme: () => null,
  setMode: () => null,
  toggleMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "ocean-depths",
  defaultMode = "light",
  storageKey = "aquamind-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey + "-theme") as Theme) || defaultTheme
  );
  
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem(storageKey + "-mode") as Mode) || defaultMode
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme and mode classes
    root.classList.remove("light", "dark");
    root.removeAttribute("data-theme");

    // Apply current theme and mode
    if (theme !== "ocean-depths") {
      root.setAttribute("data-theme", theme);
    }
    
    root.classList.add(mode);
  }, [theme, mode]);

  const value = {
    theme,
    mode,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey + "-theme", theme);
      setTheme(theme);
    },
    setMode: (mode: Mode) => {
      localStorage.setItem(storageKey + "-mode", mode);
      setMode(mode);
    },
    toggleMode: () => {
      const newMode = mode === "light" ? "dark" : "light";
      localStorage.setItem(storageKey + "-mode", newMode);
      setMode(newMode);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};