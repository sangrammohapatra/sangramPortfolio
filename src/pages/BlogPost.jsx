import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box, Typography, Chip, Button, Divider, Paper,
  useTheme, CircularProgress, Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDPreview from "@uiw/react-markdown-preview";
import { blogAPI } from "../services/api";
import { fadeUp } from "../utils/motionVariants";

export default function BlogPost() {
  const { slug }  = useParams();
  const theme     = useTheme();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    blogAPI.getBySlug(slug)
      .then(setPost)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: theme.palette.background.default, pt: 10 }}>
      <CircularProgress sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  if (error || !post) return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, pt: 10 }}>
      <Typography variant="h3" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Post Not Found</Typography>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />}>Back to Portfolio</Button>
    </Box>
  );

  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: "100vh", pt: 10, pb: 10 }}>
      <Box sx={{ maxWidth: 780, mx: "auto", px: { xs: 3, md: 4 } }}>
        {/* Back */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Button component={Link} to="/" startIcon={<ArrowBackIcon />}
            sx={{ mb: 4, color: theme.palette.text.secondary, "&:hover": { color: theme.palette.primary.main } }}>
            Back to Portfolio
          </Button>
        </motion.div>

        {/* Tags */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
            {(post.tags || []).map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{
                background: `${post.coverColor || theme.palette.primary.main}15`,
                color: post.coverColor || theme.palette.primary.main,
                border: `1px solid ${(post.coverColor || theme.palette.primary.main)}30`,
                fontWeight: 700, fontSize: "0.72rem",
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
              <CalendarTodayIcon sx={{ fontSize: 14, color: theme.palette.text.muted }} />
              <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.muted }}>
                {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.muted }} />
              <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.muted }}>{post.readTime}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <VisibilityIcon sx={{ fontSize: 14, color: theme.palette.text.muted }} />
              <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.muted }}>{post.views} views</Typography>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 5 }} />

        {/* Markdown content */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box
            data-color-mode={theme.palette.mode}
            sx={{
              "& .wmde-markdown": {
                background: "transparent !important",
                color: `${theme.palette.text.secondary} !important`,
                fontSize: "1rem",
                lineHeight: 1.9,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              },
              "& .wmde-markdown h1, & .wmde-markdown h2, & .wmde-markdown h3": {
                color: `${theme.palette.text.primary} !important`,
                fontFamily: "'Syne', sans-serif",
                borderBottom: `1px solid ${theme.palette.divider}`,
                paddingBottom: "8px",
              },
              "& .wmde-markdown code": {
                background: `${theme.palette.background.elevated} !important`,
                color: `${theme.palette.primary.main} !important`,
                borderRadius: "4px",
                padding: "2px 6px",
              },
              "& .wmde-markdown pre": {
                background: `${theme.palette.background.card} !important`,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
              },
              "& .wmde-markdown blockquote": {
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                color: `${theme.palette.text.secondary} !important`,
              },
              "& .wmde-markdown a": {
                color: `${theme.palette.primary.main} !important`,
              },
            }}
          >
            <MDPreview source={post.content} />
          </Box>
        </motion.div>

        <Divider sx={{ my: 6 }} />

        {/* Back to blog */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Button component={Link} to="/#blog" startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{ borderColor: theme.palette.divider, color: theme.palette.text.secondary, "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.primary.main } }}>
            All Articles
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
