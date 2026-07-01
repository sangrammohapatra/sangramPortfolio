// Cyberpunk — dark base, neon cyan/magenta accents, scanline overlay, monospace type.
const CYAN = "#00fff5";
const MAGENTA = "#ff00c8";

export function getStyleOverrides(mode) {
  const isDark = mode === "dark";
  const bg = "#0a0a0f";
  const paper = isDark ? "#10101a" : "#12121e";

  return {
    palette: {
      primary: { main: CYAN },
      secondary: { main: MAGENTA },
      background: { default: bg, paper },
      text: { primary: "#e8fffe", secondary: "#8fa3a8" },
    },
    typography: {
      fontFamily: "'Courier New', monospace",
      h1: { fontFamily: "'Courier New', monospace", fontWeight: 700 },
      h2: { fontFamily: "'Courier New', monospace", fontWeight: 700 },
      h3: { fontFamily: "'Courier New', monospace", fontWeight: 700 },
      h4: { fontFamily: "'Courier New', monospace", fontWeight: 700 },
      h5: { fontFamily: "'Courier New', monospace", fontWeight: 700 },
      h6: { fontFamily: "'Courier New', monospace", fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { background: bg },
          ".cyberpunk-scanlines": {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            pointerEvents: "none",
            opacity: 0.06,
            background:
              "repeating-linear-gradient(0deg, rgba(0,255,245,0.6) 0px, rgba(0,255,245,0.6) 1px, transparent 1px, transparent 3px)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: paper,
            border: `1px solid ${CYAN}40`,
            boxShadow: `0 0 12px ${CYAN}22`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { fontFamily: "'Courier New', monospace" },
          containedPrimary: {
            background: "#000",
            color: CYAN,
            border: `1px solid ${CYAN}`,
            boxShadow: `0 0 16px ${CYAN}55`,
            "&:hover": {
              background: CYAN,
              color: "#000",
              boxShadow: `0 0 32px ${CYAN}aa`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: "'Courier New', monospace",
            border: `1px solid ${MAGENTA}`,
            color: MAGENTA,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${CYAN}33`,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h1: { textShadow: `0 0 8px ${CYAN}88` },
          h2: { textShadow: `0 0 8px ${CYAN}88` },
          h3: { textShadow: `0 0 6px ${CYAN}66` },
        },
      },
    },
  };
}
