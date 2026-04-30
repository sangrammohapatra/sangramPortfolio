import React from "react";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { roles } from "../data/roles";
import { fadeUp } from "../utils/motionVariants";

export default function Roles() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();

  return (
    <SectionWrapper id="roles" title="Roles & Positions" subtitle="LEADERSHIP & INVOLVEMENT">
      <Box ref={ref}>
        <Grid container spacing={3}>
          {roles.map((role, i) => (
            <Grid item xs={12} sm={6} key={role.id}>
              <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={i}>
                <Paper sx={{
                  p: 3,
                  height: "100%",
                  background: theme.palette.background.card,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  display: "flex", alignItems: "flex-start", gap: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: role.color,
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 32px ${role.color}12`,
                  },
                }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: 2.5, flexShrink: 0,
                    background: `${role.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                  }}>
                    {role.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: theme.palette.text.primary, mb: 0.2 }}>
                      {role.title}
                    </Typography>
                    <Typography sx={{ color: role.color, fontWeight: 600, fontSize: "0.82rem", mb: 0.3 }}>
                      {role.organization}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.muted, fontSize: "0.75rem", mb: 1 }}>
                      {role.duration}
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.secondary, lineHeight: 1.65 }}>
                      {role.description}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </SectionWrapper>
  );
}
