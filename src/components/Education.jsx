import React from "react";
import { Box, Typography, Grid, Paper, Chip, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { education, certifications } from "../data/education";
import { fadeUp } from "../utils/motionVariants";

export default function Education() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box sx={{ background: theme.palette.mode === "dark" ? "rgba(0,255,135,0.015)" : "rgba(0,255,135,0.015)" }}>
      <SectionWrapper id="education" title="Education" subtitle="MY BACKGROUND">
        <Box ref={ref}>
          <Grid container spacing={3}>
            {education.map((edu, i) => (
              <Grid item xs={12} key={edu.id}>
                <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={i}>
                  <Paper sx={{
                    p: { xs: 3, md: 4 },
                    background: theme.palette.background.card,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    display: "flex", alignItems: "flex-start", gap: 3,
                    transition: "all 0.3s",
                    "&:hover": { borderColor: edu.color, boxShadow: `0 8px 32px ${edu.color}15` },
                  }}>
                    <Box sx={{
                      width: 52, height: 52, borderRadius: 2.5, flexShrink: 0,
                      background: `${edu.color}18`, border: `1px solid ${edu.color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <SchoolIcon sx={{ color: edu.color, fontSize: 26 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: theme.palette.text.primary, mb: 0.5 }}>
                        {edu.degree}
                      </Typography>
                      <Typography sx={{ color: edu.color, fontWeight: 600, fontSize: "0.9rem", mb: 0.5 }}>
                        {edu.institution}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.muted, fontSize: "0.82rem" }}>
                        {edu.location} · {edu.year}
                      </Typography>
                      {edu.grade && (
                        <Chip label={`Grade: ${edu.grade}`} size="small" sx={{ mt: 1.5, background: `${edu.color}15`, color: edu.color, border: `1px solid ${edu.color}30`, fontWeight: 600, fontSize: "0.72rem" }} />
                      )}
                    </Box>
                    {edu.logo && (
                      <Box sx={{ width: 60, height: 60, flexShrink: 0 }}>
                        <img src={edu.logo} alt={edu.institution} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Certifications */}
          <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
            Certifications
          </Typography>
          <Grid container spacing={3}>
            {certifications.map((cert, i) => (
              <Grid item xs={12} sm={6} key={cert.id}>
                <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={i + 2}>
                  <Paper sx={{
                    p: 3,
                    background: theme.palette.background.card,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    display: "flex", alignItems: "flex-start", gap: 2.5,
                    transition: "all 0.3s",
                    "&:hover": { borderColor: cert.color, transform: "translateY(-3px)", boxShadow: `0 8px 24px ${cert.color}12` },
                  }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 2, flexShrink: 0,
                      background: `${cert.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <VerifiedIcon sx={{ color: cert.color, fontSize: 22 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: theme.palette.text.primary, mb: 0.3 }}>
                        {cert.name}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem", mb: 0.5 }}>
                        {cert.issuer}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography sx={{ color: theme.palette.text.muted, fontSize: "0.75rem" }}>
                          {cert.date}
                        </Typography>
                        {cert.credentialUrl !== "#" && (
                          <Button size="small" endIcon={<OpenInNewIcon sx={{ fontSize: "12px !important" }} />} href={cert.credentialUrl} target="_blank" sx={{ fontSize: "0.72rem", p: 0, minWidth: 0, color: cert.color }}>
                            Verify
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </SectionWrapper>
    </Box>
  );
}
