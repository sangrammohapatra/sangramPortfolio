import React, { useState } from "react";
import { Box, Typography, Paper, Avatar, IconButton, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <SectionWrapper id="testimonials" title="Testimonials" subtitle="WHAT PEOPLE SAY">
      <Box ref={ref} sx={{ maxWidth: 740, mx: "auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <Paper sx={{
            p: { xs: 4, md: 6 },
            background: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}>
            {/* Decorative quote icon */}
            <FormatQuoteIcon sx={{
              position: "absolute", top: 20, left: 24,
              fontSize: 64, color: `${t.color}20`,
              transform: "rotate(180deg)",
            }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <Avatar
                  src={t.avatar}
                  sx={{
                    width: 72, height: 72,
                    mx: "auto", mb: 3,
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    border: `3px solid ${t.color}40`,
                    boxShadow: `0 0 0 6px ${t.color}15`,
                  }}
                >
                  {t.initials}
                </Avatar>

                <Typography sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: theme.palette.text.secondary,
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  mb: 3,
                  position: "relative",
                  zIndex: 1,
                }}>
                  "{t.quote}"
                </Typography>

                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: theme.palette.text.primary }}>
                  {t.name}
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", color: t.color, fontWeight: 600 }}>
                  {t.role} · {t.company}
                </Typography>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 4 }}>
              <IconButton onClick={prev} size="small" sx={{ border: `1px solid ${theme.palette.divider}`, "&:hover": { borderColor: t.color } }}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              {testimonials.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setCurrent(i)}
                  sx={{
                    width: i === current ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === current ? t.color : theme.palette.divider,
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                />
              ))}
              <IconButton onClick={next} size="small" sx={{ border: `1px solid ${theme.palette.divider}`, "&:hover": { borderColor: t.color } }}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </SectionWrapper>
  );
}
