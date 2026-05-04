import React, { useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../data/profile";

export default function OpenToWorkBanner({ visible, setVisible }) {
  const theme = useTheme();

  if (!profile.openToWork) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            overflow: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
          }}
        >
          <Box
            sx={{
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, rgba(0,255,135,0.12), rgba(240,180,41,0.1), rgba(0,255,135,0.12))"
                  : "linear-gradient(90deg, rgba(0,168,85,0.1), rgba(196,125,0,0.08), rgba(0,168,85,0.1))",
              borderBottom: `1px solid ${theme.palette.primary.main}30`,
              py: 0.7,
              px: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Animated dot */}
            <Box sx={{ position: "relative", mr: 1.5, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: theme.palette.primary.main,
                }}
              />
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: theme.palette.primary.main,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "0.72rem", sm: "0.82rem" },
                fontWeight: 700,
                color: theme.palette.primary.main,
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              {profile.openToWorkText}
            </Typography>

            <IconButton
              size="small"
              onClick={() => setVisible(false)}
              sx={{
                position: "absolute",
                right: 8,
                color: theme.palette.text.muted,
                "&:hover": { color: theme.palette.primary.main },
                p: 0.5,
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
