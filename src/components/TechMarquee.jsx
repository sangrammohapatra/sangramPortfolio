import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const TECHS = [
  { name: "ReactJS", icon: "⚛️" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Node.js", icon: "🟢" },
  { name: "Express.js", icon: "🚂" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Redux", icon: "🔮" },
  { name: "SAP S/4HANA", icon: "🏢" },
  { name: "SAP BTP", icon: "☁️" },
  { name: "Figma", icon: "🎨" },
  { name: "Git", icon: "🐙" },
  { name: "REST APIs", icon: "🔗" },
  { name: "JavaScript", icon: "🟡" },
];

// Duplicate for seamless loop
const ITEMS = [...TECHS, ...TECHS];

function MarqueeRow({ reverse = false }) {
  const theme = useTheme();
  return (
    <Box sx={{ overflow: "hidden", my: 1 }}>
      <motion.div
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        style={{ display: "flex", gap: 12, width: "max-content" }}
      >
        {ITEMS.map((tech, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2.5,
              py: 1,
              background: theme.palette.background.card,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 16px ${theme.palette.primary.main}20`,
              },
            }}
          >
            <span style={{ fontSize: "1rem" }}>{tech.icon}</span>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: theme.palette.text.secondary,
                letterSpacing: "0.04em",
              }}
            >
              {tech.name}
            </Typography>
          </Box>
        ))}
      </motion.div>
    </Box>
  );
}

export default function TechMarquee() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: 5,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        overflow: "hidden",
      }}
    >
      <MarqueeRow />
      <MarqueeRow reverse />
    </Box>
  );
}
