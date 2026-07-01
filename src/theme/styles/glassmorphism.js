// Glassmorphism — frosted-glass panels, backdrop blur, translucent borders.
export function getStyleOverrides(mode) {
  const isDark = mode === "dark";
  const glassBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.35)";
  const glassBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)";
  const bodyBg = isDark
    ? "radial-gradient(circle at 20% 20%, #1a2a3a 0%, #050505 60%), radial-gradient(circle at 80% 70%, #2a1a3a 0%, #050505 60%)"
    : "radial-gradient(circle at 20% 20%, #dceeff 0%, #f0fff4 60%), radial-gradient(circle at 80% 70%, #ffe0f0 0%, #f0fff4 60%)";

  return {
    palette: {},
    typography: {},
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: bodyBg,
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: glassBg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${glassBorder}`,
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.35)"
              : "0 8px 32px rgba(31,38,135,0.15)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: glassBg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${glassBorder}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            background: glassBg,
            backdropFilter: "blur(8px)",
            border: `1px solid ${glassBorder}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(8px)",
          },
        },
      },
    },
  };
}
