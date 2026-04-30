import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const METRICS = [
  { value: 60, suffix: "%", label: "Manual effort reduced", icon: "⚡" },
  { value: 4, suffix: "+", label: "Enterprise clients shipped", icon: "🏢" },
  { value: 2, suffix: "+", label: "Years of experience", icon: "📅" },
  { value: 2, suffix: "", label: "Developers mentored", icon: "🎓" },
  { value: 80, suffix: "%", label: "QC logging eliminated", icon: "✅" },
  { value: 35, suffix: "%", label: "Faster page load times", icon: "🚀" },
];

function Counter({ target, suffix, isInView }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    const duration = 1800;
    const steps = 50;
    const step = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function MetricsCounter() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation(0.2);

  return (
    <Box
      ref={ref}
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 6 },
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(0,255,135,0.03), rgba(240,180,41,0.02))"
            : "linear-gradient(135deg, rgba(0,168,85,0.04), rgba(196,125,0,0.02))",
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Grid container spacing={3} justifyContent="center">
          {METRICS.map((m, i) => (
            <Grid item xs={6} sm={4} md={2} key={m.label}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Box sx={{ textAlign: "center", px: 1 }}>
                  <Typography sx={{ fontSize: "1.6rem", mb: 0.5 }}>
                    {m.icon}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: { xs: "2rem", md: "2.4rem" },
                      color: theme.palette.primary.main,
                      lineHeight: 1,
                      mb: 0.8,
                      textShadow: `0 0 24px ${theme.palette.primary.main}40`,
                    }}
                  >
                    <Counter
                      target={m.value}
                      suffix={m.suffix}
                      isInView={isInView}
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      lineHeight: 1.4,
                    }}
                  >
                    {m.label}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
