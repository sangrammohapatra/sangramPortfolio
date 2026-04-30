import React from "react";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { profile } from "../data/profile";
import { fadeUp } from "../utils/motionVariants";

const stats = [
  { value: "2+", label: "Years Experience" },
  { value: "4", label: "Clients Shipped" },
  { value: "5+", label: "Products Built" },
  { value: "2", label: "Devs Mentored" },
];

export default function About() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box sx={{ background: theme.palette.mode === "dark" ? "rgba(0,255,135,0.02)" : "rgba(0,255,135,0.02)" }}>
      <SectionWrapper id="about" title="About Me" subtitle="WHO I AM">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box ref={ref}>
              {profile.about.split("\n\n").map((para, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={i}
                >
                  <Typography sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.85,
                    mb: 2.5,
                    fontSize: "1.0rem",
                  }}>
                    {para}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              {stats.map((stat, i) => (
                <Grid item xs={6} key={stat.label}>
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    custom={i + 2}
                  >
                    <Paper sx={{
                      p: 3,
                      textAlign: "center",
                      background: theme.palette.background.card,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 3,
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 32px rgba(0,255,135,0.12)`,
                      },
                    }}>
                      <Typography sx={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        lineHeight: 1,
                        mb: 0.5,
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{
                        fontSize: "0.78rem",
                        color: theme.palette.text.muted,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </SectionWrapper>
    </Box>
  );
}
