import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Paper,
  Grid,
  useTheme,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { projects } from "../data/projects";
import { fadeUp } from "../utils/motionVariants";

function Section({ title, children, delay = 0, isInView = true }) {
  const theme = useTheme();
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            "&::before": {
              content: '""',
              display: "inline-block",
              width: 4,
              height: 20,
              borderRadius: 2,
              background: theme.palette.primary.main,
              boxShadow: `0 0 12px ${theme.palette.primary.main}`,
            },
          }}
        >
          {title}
        </Typography>
        {children}
      </Box>
    </motion.div>
  );
}

export default function ProjectCaseStudy() {
  const { slug } = useParams();
  const theme = useTheme();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          pt: 10,
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          Project Not Found
        </Typography>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />}>
          Back to Portfolio
        </Button>
      </Box>
    );
  }

  const cs = project.caseStudy;

  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        minHeight: "100vh",
        pt: 10,
        pb: 12,
      }}
    >
      {/* Hero band */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${project.color}10, ${project.color}05)`,
          borderBottom: `1px solid ${project.color}25`,
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          mb: 6,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBackIcon />}
              sx={{
                mb: 3,
                color: theme.palette.text.secondary,
                "&:hover": { color: project.color },
              }}
            >
              Back to Portfolio
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Chip
                label={project.category}
                size="small"
                sx={{
                  background: `${project.color}15`,
                  color: project.color,
                  border: `1px solid ${project.color}35`,
                  fontWeight: 700,
                  fontSize: "0.72rem",
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
                    fontSize: "0.72rem",
                  }}
                />
              )}
            </Box>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
                letterSpacing: "-0.03em",
                color: theme.palette.text.primary,
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              {project.title}
            </Typography>
            <Typography
              sx={{
                color: project.color,
                fontWeight: 600,
                fontSize: "1.1rem",
                mb: 3,
              }}
            >
              {project.subtitle}
            </Typography>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon
                    sx={{ fontSize: 15, color: theme.palette.text.muted }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: theme.palette.text.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Duration
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {cs.duration}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupIcon
                    sx={{ fontSize: 15, color: theme.palette.text.muted }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: theme.palette.text.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Team
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {cs.team}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {project.liveUrl && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<OpenInNewIcon />}
                      href={project.liveUrl}
                      target="_blank"
                      sx={{
                        fontSize: "0.75rem",
                        background: project.color,
                        color: "#000",
                        "&:hover": { background: project.color, opacity: 0.85 },
                      }}
                    >
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      href={project.githubUrl}
                      target="_blank"
                      sx={{
                        fontSize: "0.75rem",
                        borderColor: theme.palette.divider,
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
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 3, md: 4 } }}>
        <Section title="Overview" delay={4}>
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.9,
              fontSize: "1rem",
            }}
          >
            {cs.overview}
          </Typography>
        </Section>

        <Divider sx={{ mb: 5 }} />

        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Section title="The Problem" delay={5}>
              <Paper
                sx={{
                  p: 3,
                  background: "rgba(255,77,109,0.05)",
                  border: "1px solid rgba(255,77,109,0.15)",
                  borderRadius: 3,
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.85,
                    fontSize: "0.95rem",
                  }}
                >
                  {cs.problem}
                </Typography>
              </Paper>
            </Section>
          </Grid>
          <Grid item xs={12} md={6}>
            <Section title="The Solution" delay={6}>
              <Paper
                sx={{
                  p: 3,
                  background: `${project.color}06`,
                  border: `1px solid ${project.color}20`,
                  borderRadius: 3,
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.85,
                    fontSize: "0.95rem",
                  }}
                >
                  {cs.solution}
                </Typography>
              </Paper>
            </Section>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 5 }} />

        <Section title="Impact & Results" delay={7}>
          <Grid container spacing={2}>
            {cs.impact.map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2.5,
                    background: theme.palette.background.card,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: project.color,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: project.color,
                      mt: 0.6,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${project.color}`,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Divider sx={{ mb: 5 }} />

        <Grid container spacing={5}>
          <Grid item xs={12} md={7}>
            <Section title="My Role" delay={8}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.9,
                  fontSize: "0.95rem",
                }}
              >
                {cs.role}
              </Typography>
            </Section>
          </Grid>
          <Grid item xs={12} md={5}>
            <Section title="Tech Stack" delay={9}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {project.tech.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    sx={{
                      background: `${project.color}12`,
                      color: project.color,
                      border: `1px solid ${project.color}30`,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  />
                ))}
              </Box>
            </Section>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* Other projects */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={10}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              mb: 3,
              color: theme.palette.text.primary,
            }}
          >
            Other Projects
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {projects
              .filter((p) => p.slug !== slug)
              .map((p) => (
                <Paper
                  key={p.id}
                  component={Link}
                  to={`/projects/${p.slug}`}
                  onClick={() => window.scrollTo(0, 0)}
                  sx={{
                    p: 2.5,
                    textDecoration: "none",
                    background: theme.palette.background.card,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: p.color,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: theme.palette.text.primary,
                        mb: 0.2,
                      }}
                    >
                      {p.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: p.color,
                        fontWeight: 600,
                      }}
                    >
                      {p.subtitle}
                    </Typography>
                  </Box>
                  <ArrowBackIcon
                    sx={{
                      transform: "rotate(180deg)",
                      color: theme.palette.text.muted,
                      fontSize: 18,
                    }}
                  />
                </Paper>
              ))}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
