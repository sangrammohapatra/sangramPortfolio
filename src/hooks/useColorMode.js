import { useState, useMemo } from "react";
import { getTheme } from "../theme/theme";

export function useColorMode(uiStyle = "default") {
  const [mode, setMode] = useState("dark");
  const theme = useMemo(() => getTheme(mode, uiStyle), [mode, uiStyle]);
  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  return { mode, theme, toggleMode };
}
