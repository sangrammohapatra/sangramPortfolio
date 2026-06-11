import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { projects } from "../data/projects";
import { scaleIn } from "../utils/motionVariants";

function SpotlightCard({ children, color, sx = {} }) {
  const wrapRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMouseMove = useCallback((e) => {
    const el = wrapRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const rx = ((e.clientY - top) / height - 0.5) * -10;
    const ry = ((e.clientX - left) / width - 0.5) * 10;
    setMouse({ x, y });
    setTilt({ rx, ry });
  }, []);

  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  return (
    <Box
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{ height: "100%", perspective: "800px" }}
    >
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
          transition: hovered
            ? "transform 0.1s ease-out, box-shadow 0.3s, border-color 0.3s"
            : "transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s, border-color 0.3s",
          ...sx,
        }}
      >
        {/* Spotlight gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            borderRadius: "inherit",
            background: hovered
              ? `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, ${color}28 0%, transparent 58%)`
              : "transparent",
            transition: hovered ? "none" : "background 0.4s ease",
          }}
        />
        {children}
      </Paper>
    </Box>
  );
}

const FILTERS = ["All", "Enterprise", "Personal"];

export default function Projects() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <SectionWrapper id="projects" title="Projects" subtitle="THINGS I'VE BUILT">
      <Box ref={ref}>
        <Box sx={{ display: "flex", gap: 1, mb: 5, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <Chip
              key={f}
              label={f}
              onClick={() => setFilter(f)}
              sx={{
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                background:
                  filter === f
                    ? theme.palette.primary.main
                    : theme.palette.background.card,
                color: filter === f ? "#000" : theme.palette.text.secondary,
                border: `1px solid ${filter === f ? theme.palette.primary.main : theme.palette.divider}`,
                transition: "all 0.2s",
                "&:hover": {
                  background:
                    filter === f
                      ? theme.palette.primary.main
                      : theme.palette.background.elevated,
                },
              }}
            />
          ))}
        </Box>

        <Grid container spacing={3}>
          <AnimatePresence mode="wait">
            {filtered.map((project, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={project.featured ? 6 : 4}
                key={project.id}
              >
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={i}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <SpotlightCard
                    color={project.color}
                    sx={{
                      background: theme.palette.background.card,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 3,
                      "&:hover": {
                        borderColor: project.color,
                        boxShadow: `0 20px 56px ${project.color}28`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 6,
                        background: `linear-gradient(90deg, ${project.color}, ${project.color}66)`,
                      }}
                    />
                    <Box
                      sx={{
                        p: 3.5,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={project.category}
                          size="small"
                          sx={{
                            background: `${project.color}15`,
                            color: project.color,
                            border: `1px solid ${project.color}35`,
                            fontWeight: 700,
                            fontSize: "0.68rem",
                          }}
                        />
                        {project.featured && (
                          <Chip
                            label="Featured"
                            size="small"
                            sx={{
                              background: `${theme.palette.secondary.main}15`,
                              color: theme.palette.secondary.main,
                              border: `1px solid ${theme.palette.secondary.main}35`,
                              fontWeight: 700,
                              fontSize: "0.68rem",
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: "1.15rem",
                          color: theme.palette.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          color: project.color,
                          fontWeight: 600,
                          mb: 1.5,
                        }}
                      >
                        {project.subtitle}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: theme.palette.text.secondary,
                          lineHeight: 1.7,
                          mb: 2.5,
                          flex: 1,
                        }}
                      >
                        {project.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.7,
                          mb: 3,
                        }}
                      >
                        {project.tech.map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            size="small"
                            sx={{
                              background: theme.palette.background.elevated,
                              color: theme.palette.text.secondary,
                              border: `1px solid ${theme.palette.divider}`,
                              fontSize: "0.68rem",
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mt: "auto",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Case study link — always shown */}
                        <Button
                          component={Link}
                          to={`/projects/${project.slug}`}
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForwardIcon fontSize="inherit" />}
                          sx={{
                            fontSize: "0.75rem",
                            background: project.color,
                            color: "#000",
                            "&:hover": {
                              background: project.color,
                              opacity: 0.85,
                            },
                          }}
                        >
                          Case Study
                        </Button>
                        {project.liveUrl && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<OpenInNewIcon fontSize="inherit" />}
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              fontSize: "0.75rem",
                              borderColor: theme.palette.divider,
                              color: theme.palette.text.secondary,
                              "&:hover": {
                                borderColor: project.color,
                                color: project.color,
                              },
                            }}
                          >
                            Live
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<GitHubIcon fontSize="inherit" />}
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              fontSize: "0.75rem",
                              borderColor: theme.palette.divider,
                              color: theme.palette.text.secondary,
                              "&:hover": {
                                borderColor: project.color,
                                color: project.color,
                              },
                            }}
                          >
                            GitHub
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </SpotlightCard>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Box>
    </SectionWrapper>
  );
}
