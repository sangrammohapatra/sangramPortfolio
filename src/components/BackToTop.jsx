import React, { useState, useEffect } from "react";
import { Fab, Tooltip, useTheme, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function BackToTop() {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <Tooltip title="Back to top" placement="top">
      <Zoom in={show}>
        <Fab
          size="small"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            top: "90%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 999,
            background: "transparent",
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            boxShadow: `0 0 16px ${theme.palette.primary.main}30`,
            "&:hover": {
              background: theme.palette.primary.main,
              color: "#000",
              boxShadow: `0 0 28px ${theme.palette.primary.main}60`,
            },
            transition: "all 0.2s",
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Tooltip>
  );
}
