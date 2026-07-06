import { useState, useMemo } from "react";
import { getTheme } from "../theme/theme";

export function useColorMode() {
  const [mode, setMode] = useState("dark");
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  return { mode, theme, toggleMode };
}
