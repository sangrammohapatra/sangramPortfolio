// Neomorphism — soft extruded shadows on a neutral base, depth via shadow only.
export function getStyleOverrides(mode) {
  const isDark = mode === "dark";
  const base = isDark ? "#1e2126" : "#e0e5ec";
  const shadowDark = isDark ? "#121417" : "#b8bec7";
  const shadowLight = isDark ? "#2a2e35" : "#ffffff";

  const extruded = `6px 6px 12px ${shadowDark}, -6px -6px 12px ${shadowLight}`;
  const inset = `inset 3px 3px 6px ${shadowDark}, inset -3px -3px 6px ${shadowLight}`;

  return {
    palette: {
      background: {
        default: base,
        paper: base,
      },
    },
    typography: {},
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { background: base },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: base,
            border: "none",
            borderRadius: 16,
            boxShadow: extruded,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: base,
            border: "none",
            borderRadius: 16,
            boxShadow: extruded,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            background: base,
            borderRadius: 16,
            boxShadow: extruded,
            "&:hover": { boxShadow: extruded },
            "&:active": { boxShadow: inset },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            background: base,
            borderRadius: 16,
            boxShadow: inset,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: base,
            boxShadow: `0 6px 12px ${shadowDark}`,
          },
        },
      },
    },
  };
}
