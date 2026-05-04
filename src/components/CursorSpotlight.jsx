import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material";

export default function CursorSpotlight() {
  const theme = useTheme();
  const spotRef = useRef(null);

  useEffect(() => {
    if (theme.palette.mode !== "dark") return;
    const el = spotRef.current;
    if (!el) return;

    const move = (e) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.style.opacity = "1";
    };
    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
    };
  }, [theme.palette.mode]);

  if (theme.palette.mode !== "dark") return null;

  return (
    <div
      ref={spotRef}
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 0,
        width: 500,
        height: 500,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle, rgba(0,255,135,0.08) 0%, transparent 90%)",
        transition: "opacity 0.3s",
        opacity: 0,
      }}
    />
  );
}
