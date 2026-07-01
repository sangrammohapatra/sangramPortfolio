// Neo-Brutalism — zero radius, thick black borders, hard offset shadows.
export function getStyleOverrides(mode) {
  const isDark = mode === "dark";
  const bg = isDark ? "#0a0a0a" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#000000";
  const border = isDark ? "#ffffff" : "#000000";
  const hardShadow = `4px 4px 0px ${border}`;

  return {
    palette: {
      background: { default: bg, paper: bg },
    },
    typography: {
      fontWeightBold: 900,
      button: { fontWeight: 800, textTransform: "uppercase" },
    },
    shape: { borderRadius: 0 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { background: bg, color: fg },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: `3px solid ${border}`,
            boxShadow: hardShadow,
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: `3px solid ${border}`,
            boxShadow: hardShadow,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: `3px solid ${border}`,
            boxShadow: hardShadow,
            fontWeight: 800,
            "&:hover": {
              boxShadow: "none",
              transform: "translate(4px, 4px)",
            },
            transition: "all 0.1s ease",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: `2px solid ${border}`,
            fontWeight: 800,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderBottom: `3px solid ${border}`,
            boxShadow: "none",
          },
        },
      },
    },
  };
}
