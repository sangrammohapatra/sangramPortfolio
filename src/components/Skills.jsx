import React from "react";
import { Box, Typography, Grid, Paper, LinearProgress, Chip, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { technicalSkills, softSkills } from "../data/skills";
import { fadeUp, scaleIn } from "../utils/motionVariants";

function SkillBar({ name, level, index, isInView }) {
  const theme = useTheme();
  return (
    <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={index}>
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: theme.palette.text.primary }}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: theme.palette.text.muted, fontWeight: 500 }}>
            {level}%
          </Typography>
        </Box>
        <Box sx={{ position: "relative", height: 6, borderRadius: 3, background: theme.palette.divider, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${level}%` } : { width: 0 }}
            transition={{ duration: 1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
}

export default function Skills() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();

  return (
    <SectionWrapper id="skills" title="Skills" subtitle="WHAT I WORK WITH">
      <Box ref={ref}>
        {/* Technical Skills */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {technicalSkills.map((cat, ci) => (
            <Grid item xs={12} sm={6} key={cat.category}>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={ci}>
                <Paper sx={{
                  p: 3.5,
                  background: theme.palette.background.card,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  height: "100%",
                  "&:hover": { borderColor: `${theme.palette.primary.main}50` },
                  transition: "border-color 0.3s",
                }}>
                  <Typography sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: theme.palette.primary.main,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 2.5,
                  }}>
                    {cat.category}
                  </Typography>
                  {cat.skills.map((skill, si) => (
                    <SkillBar key={skill.name} {...skill} index={si} isInView={isInView} />
                  ))}
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Soft Skills */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
            Soft Skills
          </Typography>
        </motion.div>
        <Grid container spacing={2.5}>
          {softSkills.map((skill, i) => (
            <Grid item xs={12} sm={6} md={4} key={skill.name}>
              <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={i + 5}>
                <Paper sx={{
                  p: 3,
                  background: theme.palette.background.card,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  display: "flex", alignItems: "flex-start", gap: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-3px)",
                    boxShadow: `0 8px 24px rgba(0,255,135,0.1)`,
                  },
                }}>
                  <Typography sx={{ fontSize: "1.6rem", lineHeight: 1, mt: 0.2 }}>{skill.icon}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", mb: 0.5, color: theme.palette.text.primary }}>
                      {skill.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                      {skill.desc}
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
