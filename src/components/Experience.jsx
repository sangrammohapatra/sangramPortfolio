import React, { useState } from "react";
import {
  Box, Typography, Paper, Chip, Collapse, IconButton, Grid, useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WorkIcon from "@mui/icons-material/Work";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { experiences } from "../data/experience";
import { fadeUp, slideLeft } from "../utils/motionVariants";

function ProjectCard({ project, index, isInView }) {
  const theme = useTheme();
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={index + 2}>
      <Paper sx={{
        mb: 2, borderRadius: 3,
        background: theme.palette.background.elevated,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        transition: "border-color 0.3s",
        "&:hover": { borderColor: `${theme.palette.primary.main}60` },
      }}>
        <Box
          sx={{
            px: 3, py: 2.5, display: "flex", alignItems: "center",
            justifyContent: "space-between", cursor: "pointer",
          }}
          onClick={() => setOpen(!open)}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: theme.palette.text.primary }}>
              {project.name}
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: theme.palette.text.secondary, mt: 0.3 }}>
              {project.description}
            </Typography>
          </Box>
          <IconButton
            size="small"
            sx={{ transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0deg)", ml: 2, flexShrink: 0 }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
        <Collapse in={open}>
          <Box sx={{ px: 3, pb: 3 }}>
            <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 2 }}>
              {project.bullets.map((b, i) => (
                <Box component="li" key={i} sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: "0.875rem", color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                    {b}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {project.tech.map((t) => (
                <Chip
                  key={t} label={t} size="small"
                  sx={{
                    background: "rgba(0,255,135,0.1)",
                    color: theme.palette.primary.main,
                    border: "1px solid rgba(0,255,135,0.2)",
                    fontWeight: 600, fontSize: "0.7rem",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </motion.div>
  );
}

export default function Experience() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box sx={{ background: theme.palette.mode === "dark" ? "rgba(0,255,135,0.015)" : "rgba(0,255,135,0.015)" }}>
      <SectionWrapper id="experience" title="Experience" subtitle="WHERE I'VE WORKED">
        <Box ref={ref}>
          {experiences.map((exp, ei) => (
            <Box key={exp.id} sx={{ position: "relative", pl: { md: 4 } }}>
              {/* Timeline line (desktop) */}
              <Box sx={{
                display: { xs: "none", md: "block" },
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 2,
                background: `linear-gradient(180deg, ${theme.palette.primary.main}, transparent)`,
                borderRadius: 1,
              }} />

              {/* Timeline dot */}
              <Box sx={{
                display: { xs: "none", md: "flex" },
                position: "absolute", left: -5, top: 24,
                width: 12, height: 12,
                borderRadius: "50%",
                background: theme.palette.primary.main,
                boxShadow: `0 0 0 4px ${theme.palette.background.default}, 0 0 0 6px ${theme.palette.primary.main}40`,
                alignItems: "center", justifyContent: "center",
              }} />

              {/* Company Header */}
              <motion.div variants={slideLeft} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={0}>
                <Paper sx={{
                  p: { xs: 3, md: 4 }, mb: 3,
                  background: theme.palette.background.card,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 2,
                      background: "linear-gradient(135deg, #00ff8722, #00ff8744)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <WorkIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                        <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: theme.palette.text.primary }}>
                          {exp.role}
                        </Typography>
                        <Chip label={exp.type} size="small" sx={{ background: "rgba(240,180,41,0.12)", color: "#f0b429", fontWeight: 700, fontSize: "0.68rem" }} />
                      </Box>
                      <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700, fontSize: "0.95rem" }}>
                        {exp.company}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.muted, fontSize: "0.82rem", mt: 0.2 }}>
                        {exp.duration} · {exp.location}
                      </Typography>
                    </Box>
                  </Box>

                  {/* General bullets */}
                  <Box sx={{ mb: 2 }}>
                    {exp.generalBullets.map((b, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: theme.palette.secondary.main, mt: 0.7, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: "0.875rem", color: theme.palette.text.secondary, lineHeight: 1.7 }}>{b}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </motion.div>

              {/* Projects */}
              {exp.projects.map((proj, pi) => (
                <ProjectCard key={proj.name} project={proj} index={pi} isInView={isInView} />
              ))}
            </Box>
          ))}
        </Box>
      </SectionWrapper>
    </Box>
  );
}
