import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box, Typography, Chip, Button, Divider, Paper, useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { blogPosts } from "../data/blog";
import { fadeUp } from "../utils/motionVariants";

// Very simple markdown-like renderer — handles ## headers and **bold**
function RenderContent({ content }) {
  const theme = useTheme();
  const lines = content.trim().split("\n");

  return (
    <Box>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <Typography key={i} variant="h5" sx={{ mt: 4, mb: 1.5, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: theme.palette.text.primary }}>
              {line.replace("## ", "")}
            </Typography>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <Typography key={i} variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
              {line.replace("### ", "")}
            </Typography>
          );
        }
        if (line.startsWith("- ")) {
          const text = line.replace("- ", "");
          return (
            <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 0.8 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: theme.palette.primary.main, mt: 0.9, flexShrink: 0 }} />
              <Typography sx={{ fontSize: "1rem", color: theme.palette.text.secondary, lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: text.replace(/`([^`]+)`/g, `<code style="background:${theme.palette.mode === "dark" ? "#1a2840" : "#e8f0ff"};color:${theme.palette.primary.main};padding:2px 6px;border-radius:4px;font-size:0.9em;font-family:monospace">$1</code>`) }}
              />
            </Box>
          );
        }
        if (line.startsWith("> ")) {
          return (
            <Box key={i} sx={{ borderLeft: `3px solid ${theme.palette.primary.main}`, pl: 3, my: 2.5, py: 0.5 }}>
              <Typography sx={{ fontSize: "1.05rem", color: theme.palette.text.secondary, fontStyle: "italic", lineHeight: 1.8 }}>
                {line.replace("> ", "")}
              </Typography>
            </Box>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <Typography key={i} sx={{ fontWeight: 700, fontSize: "1rem", color: theme.palette.text.primary, mt: 2, mb: 0.5 }}>
              {line.replace(/\*\*/g, "")}
            </Typography>
          );
        }
        if (line.trim() === "") return <Box key={i} sx={{ height: 8 }} />;
        return (
          <Typography key={i} sx={{ fontSize: "1rem", color: theme.palette.text.secondary, lineHeight: 1.9, mb: 0.5 }}
            dangerouslySetInnerHTML={{
              __html: line
                .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${theme.palette.text.primary}">$1</strong>`)
                .replace(/`([^`]+)`/g, `<code style="background:${theme.palette.mode === "dark" ? "#1a2840" : "#e8f0ff"};color:${theme.palette.primary.main};padding:2px 6px;border-radius:4px;font-size:0.9em;font-family:monospace">$1</code>`)
            }}
          />
        );
      })}
    </Box>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!post) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, pt: 10 }}>
        <Typography variant="h3" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Post Not Found</Typography>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />}>Back to Portfolio</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: "100vh", pt: 10, pb: 10 }}>
      <Box sx={{ maxWidth: 780, mx: "auto", px: { xs: 3, md: 4 } }}>
        {/* Back */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4, color: theme.palette.text.secondary, "&:hover": { color: theme.palette.primary.main } }}
          >
            Back to Portfolio
          </Button>
        </motion.div>

        {/* Tags */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
            {post.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{
                background: `${post.coverColor}15`, color: post.coverColor,
                border: `1px solid ${post.coverColor}30`, fontWeight: 700, fontSize: "0.72rem",
              }} />
            ))}
          </Box>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Typography variant="h2" sx={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: { xs: "1.9rem", md: "2.5rem" },
            letterSpacing: "-0.03em",
            color: theme.palette.text.primary,
            lineHeight: 1.2, mb: 2.5,
          }}>
            {post.title}
          </Typography>
        </motion.div>

        {/* Meta */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ display: "flex", gap: 3, mb: 5, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <CalendarTodayIcon sx={{ fontSize: 15, color: theme.palette.text.muted }} />
              <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.muted }}>{post.date}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <AccessTimeIcon sx={{ fontSize: 15, color: theme.palette.text.muted }} />
              <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.muted }}>{post.readTime}</Typography>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 5 }} />

        {/* Content */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <RenderContent content={post.content} />
        </motion.div>

        <Divider sx={{ my: 6 }} />

        {/* More posts */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 3, color: theme.palette.text.primary }}>
            More Articles
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {blogPosts.filter((p) => p.slug !== slug).map((p) => (
              <Paper
                key={p.id}
                component={Link}
                to={`/blog/${p.slug}`}
                onClick={() => window.scrollTo(0, 0)}
                sx={{
                  p: 2.5, textDecoration: "none",
                  background: theme.palette.background.card,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: p.coverColor, transform: "translateX(4px)" },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: theme.palette.text.primary, mb: 0.3 }}>{p.title}</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: theme.palette.text.muted }}>{p.date} · {p.readTime}</Typography>
                </Box>
                <ArrowBackIcon sx={{ transform: "rotate(180deg)", color: theme.palette.text.muted, fontSize: 18 }} />
              </Paper>
            ))}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
