import { createTheme } from "@mui/material/styles";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: Pure black base, neon green primary, warm gold accent.
// "Terminal luxury" — hacker aesthetic meets premium finish.

const GREEN = "#00ff87";   // neon mint-green
const GOLD  = "#f0b429";   // warm gold
const CORAL = "#ff4d6d";   // coral accent
const DIM   = "#00cc6a";   // dimmed green for dark states

export const getTheme = (mode) => {
  const base = {
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary:    { main: GREEN, light: "#5fffa8", dark: DIM },
            secondary:  { main: GOLD,  light: "#ffd166", dark: "#c47d00" },
            background: {
              default:  "#050505",
              paper:    "#0d0d0d",
              card:     "#111111",
              elevated: "#1a1a1a",
            },
            text: {
              primary:   "#f0fff4",
              secondary: "#7a9e88",
              muted:     "#3a4a3f",
            },
            divider: "rgba(0,255,135,0.08)",
          }
        : {
            primary:    { main: "#00a855", light: "#00cc6a", dark: "#007a3d" },
            secondary:  { main: "#c47d00", light: GOLD,     dark: "#8a5800" },
            background: {
              default:  "#f0fff4",
              paper:    "#ffffff",
              card:     "#f6fff9",
              elevated: "#ffffff",
            },
            text: {
              primary:   "#071a0f",
              secondary: "#2d5a3d",
              muted:     "#7a9e88",
            },
            divider: "rgba(0,168,85,0.12)",
          }),
      accent: { green: GREEN, gold: GOLD, coral: CORAL },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      h1: { fontFamily: "'Syne', sans-serif", fontWeight: 800 },
      h2: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
      h3: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
      h4: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
      h5: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
      h6: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
      button: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, textTransform: "none" },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": { boxSizing: "border-box" },
          html: { scrollBehavior: "smooth" },
          "::-webkit-scrollbar": { width: "5px" },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            background: "linear-gradient(180deg, #00ff87, #f0b429)",
            borderRadius: "3px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 6, padding: "10px 24px", fontWeight: 700, letterSpacing: "0.04em" },
          containedPrimary: {
            background: "#000",
            color: "#00ff87",
            border: "1px solid #00ff87",
            boxShadow: "0 0 16px rgba(0,255,135,0.2)",
            "&:hover": {
              background: "#00ff87",
              color: "#000",
              boxShadow: "0 0 32px rgba(0,255,135,0.45)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.05em", borderRadius: 4 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
    },
  };

  return createTheme(base);
};
