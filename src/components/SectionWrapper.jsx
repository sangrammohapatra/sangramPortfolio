import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function SectionWrapper({ id, title, subtitle, children, sx = {} }) {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box
      id={id}
      ref={ref}
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        maxWidth: 1200,
        mx: "auto",
        ...sx,
      }}
    >
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: { xs: 5, md: 7 } }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontSize: "0.72rem",
                display: "block",
                mb: 1,
              }}
            >
              {subtitle || ""}
            </Typography>
            <Typography variant="h2" sx={{
              fontSize: { xs: "2rem", md: "2.6rem" },
              letterSpacing: "-0.03em",
              color: theme.palette.text.primary,
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: 48,
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}>
              {title}
            </Typography>
          </Box>
        </motion.div>
      )}
      {children}
    </Box>
  );
}
