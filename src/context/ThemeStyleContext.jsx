import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "ui-style";
export const UI_STYLES = [
  "default",
  "glassmorphism",
  "neomorphism",
  "aurora",
  "neobrutalism",
  "cyberpunk",
];

const ThemeStyleContext = createContext(null);

function readInitialStyle() {
  if (typeof window === "undefined") return "default";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return UI_STYLES.includes(stored) ? stored : "default";
}

export function ThemeStyleProvider({ children }) {
  const [uiStyle, setUiStyle] = useState(readInitialStyle);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, uiStyle);
  }, [uiStyle]);

  return (
    <ThemeStyleContext.Provider value={{ uiStyle, setUiStyle }}>
      {children}
    </ThemeStyleContext.Provider>
  );
}

export function useThemeStyle() {
  return useContext(ThemeStyleContext);
}
