import React from "react";
import { Box, Typography, Grid, Paper, Chip, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { blogPosts } from "../data/blog";
import { fadeUp } from "../utils/motionVariants";

export default function Blog() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box sx={{ background: theme.palette.mode === "dark" ? "rgba(0,255,135,0.015)" : "rgba(0,255,135,0.015)" }}>
      <SectionWrapper id="blog" title="Blog" subtitle="THOUGHTS & ARTICLES">
        <Box ref={ref}>
          <Grid container spacing={3}>
            {blogPosts.map((post, i) => (
              <Grid item xs={12} md={4} key={post.id}>
                <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={i}>
                  <Paper
                    component={Link}
                    to={`/blog/${post.slug}`}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      background: theme.palette.background.card,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 3,
                      overflow: "hidden",
                      textDecoration: "none",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        borderColor: post.coverColor,
                        boxShadow: `0 16px 40px ${post.coverColor}18`,
                        "& .read-more": { gap: 1.5 },
                      },
                    }}
                  >
                    {/* Cover */}
                    <Box sx={{
                      height: 140,
                      background: `linear-gradient(135deg, ${post.coverColor}30, ${post.coverColor}08)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "3rem",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}>
                      {post.tags[0] === "React" ? "⚛️" : post.tags[0] === "SAP BTP" ? "🏢" : "📝"}
                    </Box>

                    <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                      {/* Tags */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, mb: 2 }}>
                        {post.tags.slice(0, 2).map((tag) => (
                          <Chip key={tag} label={tag} size="small" sx={{
                            background: `${post.coverColor}15`,
                            color: post.coverColor,
                            border: `1px solid ${post.coverColor}30`,
                            fontWeight: 600, fontSize: "0.65rem",
                          }} />
                        ))}
                      </Box>

                      <Typography sx={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: "1rem",
                        color: theme.palette.text.primary,
                        lineHeight: 1.4, mb: 1.5, flex: 1,
                      }}>
                        {post.title}
                      </Typography>

                      <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.secondary, lineHeight: 1.65, mb: 2.5 }}>
                        {post.excerpt.slice(0, 120)}...
                      </Typography>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.muted }} />
                          <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.muted }}>{post.readTime}</Typography>
                        </Box>
                        <Box className="read-more" sx={{ display: "flex", alignItems: "center", gap: 0.8, transition: "gap 0.2s", color: post.coverColor }}>
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: 700 }}>Read</Typography>
                          <ArrowForwardIcon sx={{ fontSize: 14 }} />
                        </Box>
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
