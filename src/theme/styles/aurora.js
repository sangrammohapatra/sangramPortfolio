// Aurora UI — animated organic gradient blobs behind existing palette content.
export function getStyleOverrides(mode) {
  const isDark = mode === "dark";
  const bodyBg = isDark ? "#050510" : "#f5f7ff";

  return {
    palette: {},
    typography: {},
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: bodyBg,
            overflowX: "hidden",
          },
          "@keyframes auroraFloat1": {
            "0%, 100%": { transform: "translate(-10%, -10%) scale(1)" },
            "50%": { transform: "translate(10%, 15%) scale(1.2)" },
          },
          "@keyframes auroraFloat2": {
            "0%, 100%": { transform: "translate(10%, 10%) scale(1.1)" },
            "50%": { transform: "translate(-15%, -5%) scale(0.9)" },
          },
          "@keyframes auroraFloat3": {
            "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
            "50%": { transform: "translate(8%, -12%) scale(1.15)" },
          },
          ".aurora-blob": {
            position: "fixed",
            borderRadius: "50%",
            filter: "blur(80px)",
            zIndex: -1,
            pointerEvents: "none",
            opacity: isDark ? 0.45 : 0.55,
          },
          ".aurora-blob-1": {
            top: "-10%",
            left: "-10%",
            width: "45vw",
            height: "45vw",
            background: "radial-gradient(circle, #00ff87 0%, transparent 70%)",
            animation: "auroraFloat1 18s ease-in-out infinite",
          },
          ".aurora-blob-2": {
            top: "30%",
            right: "-15%",
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(circle, #ff4d6d 0%, transparent 70%)",
            animation: "auroraFloat2 22s ease-in-out infinite",
          },
          ".aurora-blob-3": {
            bottom: "-15%",
            left: "20%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(circle, #f0b429 0%, transparent 70%)",
            animation: "auroraFloat3 20s ease-in-out infinite",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: isDark
              ? "rgba(10,10,20,0.55)"
              : "rgba(255,255,255,0.55)",
            backdropFilter: "blur(6px)",
          },
        },
      },
    },
  };
}
