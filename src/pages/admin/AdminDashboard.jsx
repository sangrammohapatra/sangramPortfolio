import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, Chip, Button,
  CircularProgress, Alert, useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ArticleIcon from "@mui/icons-material/Article";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublicIcon from "@mui/icons-material/Public";
import DraftIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminBlogAPI } from "../../services/api";
import { fadeUp } from "../../utils/motionVariants";

export default function AdminDashboard() {
  const theme = useTheme();
  const [blogs, setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    adminBlogAPI.getAll()
      .then(setBlogs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const published = blogs.filter((b) => b.status === "published").length;
  const drafts    = blogs.filter((b) => b.status === "draft").length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  const stats = [
    { label: "Total Posts",  value: blogs.length,  icon: <ArticleIcon />,    color: theme.palette.primary.main  },
    { label: "Published",    value: published,      icon: <PublicIcon />,     color: "#00ff87"                   },
    { label: "Drafts",       value: drafts,         icon: <DraftIcon />,      color: theme.palette.secondary.main},
    { label: "Total Views",  value: totalViews,     icon: <VisibilityIcon />, color: "#ff4d6d"                   },
  ];

  return (
    <AdminLayout>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: theme.palette.text.primary }}>
            Dashboard
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.875rem", mt: 0.5 }}>
            Welcome back. Here's your blog overview.
          </Typography>
        </Box>
        <Button
          component={Link} to="/admin/blog/new"
          variant="contained" startIcon={<AddIcon />}
        >
          New Post
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map((s, i) => (
          <Grid item xs={6} md={3} key={s.label}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={i}>
              <Paper sx={{
                p: 3,
                background: theme.palette.background.card,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                transition: "all 0.3s",
                "&:hover": { borderColor: s.color, boxShadow: `0 4px 24px ${s.color}15` },
              }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: 2, mb: 2,
                  background: `${s.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color,
                }}>
                  {React.cloneElement(s.icon, { fontSize: "small" })}
                </Box>
                <Typography sx={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "2rem", color: s.color, lineHeight: 1,
                }}>
                  {loading ? <CircularProgress size={20} sx={{ color: s.color }} /> : s.value}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.muted, mt: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  {s.label}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Recent posts */}
      <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
        Recent Posts
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : blogs.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", background: theme.palette.background.card, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
          <Typography sx={{ color: theme.palette.text.muted, mb: 2 }}>No posts yet.</Typography>
          <Button component={Link} to="/admin/blog/new" variant="contained" startIcon={<AddIcon />}>
            Create First Post
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {blogs.slice(0, 8).map((blog, i) => (
            <motion.div key={blog._id} variants={fadeUp} initial="hidden" animate="visible" custom={i}>
              <Paper sx={{
                px: 3, py: 2,
                background: theme.palette.background.card,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: `${theme.palette.primary.main}50` },
              }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: theme.palette.text.primary, mb: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {blog.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.muted }}>
                    {new Date(blog.createdAt).toLocaleDateString()} · {blog.readTime}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <VisibilityIcon sx={{ fontSize: 13, color: theme.palette.text.muted }} />
                    <Typography sx={{ fontSize: "0.75rem", color: theme.palette.text.muted }}>{blog.views || 0}</Typography>
                  </Box>
                  <Chip
                    label={blog.status}
                    size="small"
                    sx={{
                      fontSize: "0.65rem", fontWeight: 700, height: 20,
                      background: blog.status === "published" ? "rgba(0,255,135,0.12)" : "rgba(240,180,41,0.12)",
                      color: blog.status === "published" ? "#00ff87" : "#f0b429",
                      border: `1px solid ${blog.status === "published" ? "rgba(0,255,135,0.3)" : "rgba(240,180,41,0.3)"}`,
                    }}
                  />
                  <Button
                    component={Link} to={`/admin/blog/edit/${blog._id}`}
                    size="small" variant="outlined"
                    sx={{ fontSize: "0.72rem", py: 0.3, px: 1.5, borderColor: theme.palette.divider, color: theme.palette.text.secondary, "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.primary.main } }}
                  >
                    Edit
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      )}
    </AdminLayout>
  );
}
