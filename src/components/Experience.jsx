import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Collapse,
  IconButton,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WorkIcon from "@mui/icons-material/Work";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { experiences } from "../data/experience";
import { fadeUp, slideLeft } from "../utils/motionVariants";

function ProjectCard({ project, index, isInView }) {
  const theme = useTheme();
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index + 2}
    >
      <Paper
        sx={{
          mb: 2,
          borderRadius: 3,
          background: theme.palette.background.elevated,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          transition: "border-color 0.3s",
          "&:hover": { borderColor: `${theme.palette.primary.main}50` },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setOpen(!open)}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: theme.palette.text.primary,
              }}
            >
              {project.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: theme.palette.text.secondary,
                mt: 0.3,
              }}
            >
              {project.description}
            </Typography>
          </Box>
          <IconButton
            size="small"
            sx={{
              transition: "transform 0.3s",
              transform: open ? "rotate(180deg)" : "none",
              ml: 2,
              flexShrink: 0,
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
        <Collapse in={open}>
          <Box sx={{ px: 3, pb: 3 }}>
            <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 2 }}>
              {project.bullets.map((b, i) => (
                <Box component="li" key={i} sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                    }}
                  >
                    {b}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {project.tech.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  sx={{
                    background: `${theme.palette.primary.main}12`,
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.primary.main}30`,
                    fontWeight: 600,
                    fontSize: "0.7rem",
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

// ── Timeline view ──────────────────────────────────────────────────────────
function TimelineView({ experiences, isInView }) {
  const theme = useTheme();
  return (
    <Box sx={{ position: "relative", pl: { md: 5 } }}>
      {/* Vertical line */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          left: 16,
          top: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(180deg, ${theme.palette.primary.main}, transparent)`,
          borderRadius: 1,
        }}
      />

      {experiences.map((exp, ei) => (
        <motion.div
          key={exp.id}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={ei}
        >
          {/* Timeline dot */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: 9,
              mt: "28px",
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: theme.palette.primary.main,
              boxShadow: `0 0 0 4px ${theme.palette.background.default}, 0 0 12px ${theme.palette.primary.main}60`,
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: theme.palette.background.card,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: theme.palette.text.primary,
                  }}
                >
                  {exp.role}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {exp.company}
                </Typography>
              </Box>
              <Chip
                label={exp.duration}
                size="small"
                sx={{
                  background: `${theme.palette.primary.main}10`,
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.divider}`,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
              {exp.projects
                .flatMap((p) => p.tech)
                .filter((t, i, a) => a.indexOf(t) === i)
                .slice(0, 8)
                .map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    sx={{
                      background: `${theme.palette.primary.main}08`,
                      color: theme.palette.text.secondary,
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                    }}
                  />
                ))}
            </Box>
            {exp.generalBullets.map((b, i) => (
              <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 0.8 }}>
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: theme.palette.primary.main,
                    mt: 0.75,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                  }}
                >
                  {b}
                </Typography>
              </Box>
            ))}
          </Paper>
        </motion.div>
      ))}
    </Box>
  );
}

export default function Experience() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();
  const [view, setView] = useState("cards");

  return (
    <Box sx={{ background: `${theme.palette.primary.main}05` }}>
      <SectionWrapper
        id="experience"
        title="Experience"
        subtitle="WHERE I'VE WORKED"
      >
        <Box ref={ref}>
          {/* View toggle */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(_, v) => v && setView(v)}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.muted,
                    px: 2,
                    py: 0.75,
                    "&.Mui-selected": {
                      background: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      borderColor: `${theme.palette.primary.main}40`,
                    },
                  },
                }}
              >
                <ToggleButton value="cards">
                  <ViewStreamIcon fontSize="small" sx={{ mr: 0.8 }} />
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
                    Cards
                  </Typography>
                </ToggleButton>
                <ToggleButton value="timeline">
                  <AccountTreeIcon fontSize="small" sx={{ mr: 0.8 }} />
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
                    Timeline
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </motion.div>

          {/* Cards view */}
          {view === "cards" &&
            experiences.map((exp) => (
              <Box key={exp.id} sx={{ position: "relative", pl: { md: 4 } }}>
                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: `linear-gradient(180deg, ${theme.palette.primary.main}, transparent)`,
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    position: "absolute",
                    left: -5,
                    top: 24,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: theme.palette.primary.main,
                    boxShadow: `0 0 0 4px ${theme.palette.background.default}, 0 0 0 6px ${theme.palette.primary.main}40`,
                  }}
                />

                <motion.div
                  variants={slideLeft}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={0}
                >
                  <Paper
                    sx={{
                      p: { xs: 3, md: 4 },
                      mb: 3,
                      background: theme.palette.background.card,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          flexShrink: 0,
                          background: `${theme.palette.primary.main}15`,
                          border: `1px solid ${theme.palette.primary.main}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <WorkIcon
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: 22,
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "'Syne', sans-serif",
                              fontWeight: 800,
                              fontSize: "1.2rem",
                              color: theme.palette.text.primary,
                            }}
                          >
                            {exp.role}
                          </Typography>
                          <Chip
                            label={exp.type}
                            size="small"
                            sx={{
                              background: `${theme.palette.primary.main}12`,
                              color: theme.palette.primary.main,
                              fontWeight: 700,
                              fontSize: "0.68rem",
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: "0.95rem",
                          }}
                        >
                          {exp.company}
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.muted,
                            fontSize: "0.82rem",
                            mt: 0.2,
                          }}
                        >
                          {exp.duration} · {exp.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      {exp.generalBullets.map((b, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: theme.palette.secondary.main,
                              mt: 0.7,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: theme.palette.text.secondary,
                              lineHeight: 1.7,
                            }}
                          >
                            {b}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
                {exp.projects.map((proj, pi) => (
                  <ProjectCard
                    key={proj.name}
                    project={proj}
                    index={pi}
                    isInView={isInView}
                  />
                ))}
              </Box>
            ))}

          {/* Timeline view */}
          {view === "timeline" && (
            <TimelineView experiences={experiences} isInView={isInView} />
          )}
        </Box>
      </SectionWrapper>
    </Box>
  );
}
