import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Chip, Button, IconButton,
  Alert, CircularProgress, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, useTheme, TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishIcon from "@mui/icons-material/Unpublished";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminBlogAPI } from "../../services/api";
import { fadeUp } from "../../utils/motionVariants";

export default function AdminBlogList() {
  const theme = useTheme();
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [deleteId, setDeleteId]   = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const [toggling, setToggling]   = useState(null);

  const load = () => {
    setLoading(true);
    adminBlogAPI.getAll()
      .then(setBlogs).catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (blog) => {
    setToggling(blog._id);
    try {
      const updated = await adminBlogAPI.toggleStatus(blog._id, blog.status);
      setBlogs((prev) => prev.map((b) => b._id === updated._id ? updated : b));
    } catch (e) { setError(e.message); }
    setToggling(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminBlogAPI.delete(deleteId);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
      setDeleteId(null);
    } catch (e) { setError(e.message); }
    setDeleting(false);
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: theme.palette.text.primary }}>
          All Posts
        </Typography>
        <Button component={Link} to="/admin/blog/new" variant="contained" startIcon={<AddIcon />}>
          New Post
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>}

      {/* Search */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1, maxWidth: 400 }}>
        <SearchIcon sx={{ color: theme.palette.text.muted, fontSize: 20 }} />
        <TextField
          size="small" placeholder="Search posts…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              background: theme.palette.background.elevated,
              "& fieldset": { borderColor: theme.palette.divider },
              "&:hover fieldset, &.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
            },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", background: theme.palette.background.card, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
          <Typography sx={{ color: theme.palette.text.muted }}>
            {search ? "No posts match your search." : "No posts yet."}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {filtered.map((blog, i) => (
            <motion.div key={blog._id} variants={fadeUp} initial="hidden" animate="visible" custom={i}>
              <Paper sx={{
                px: 3, py: 2.5,
                background: theme.palette.background.card,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2.5,
                display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: `${theme.palette.primary.main}40` },
              }}>
                {/* Color dot */}
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: blog.coverColor || "#00ff87", flexShrink: 0 }} />

                <Box sx={{ flex: 1, minWidth: 180 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: theme.palette.text.primary, mb: 0.3 }}>
                    {blog.title}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {blog.tags?.slice(0, 3).map((t) => (
                      <Chip key={t} label={t} size="small" sx={{
                        fontSize: "0.6rem", height: 16,
                        background: `${theme.palette.primary.main}10`,
                        color: theme.palette.text.muted,
                      }} />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: theme.palette.text.muted }}>
                  <VisibilityIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: "0.78rem" }}>{blog.views || 0}</Typography>
                </Box>

                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.muted }}>
                  {new Date(blog.updatedAt).toLocaleDateString()}
                </Typography>

                <Chip
                  label={blog.status} size="small"
                  sx={{
                    fontSize: "0.65rem", fontWeight: 700, height: 20,
                    background: blog.status === "published" ? "rgba(0,255,135,0.12)" : "rgba(240,180,41,0.12)",
                    color: blog.status === "published" ? "#00ff87" : "#f0b429",
                    border: `1px solid ${blog.status === "published" ? "rgba(0,255,135,0.3)" : "rgba(240,180,41,0.3)"}`,
                  }}
                />

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title={blog.status === "published" ? "Unpublish" : "Publish"}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggle(blog)}
                      disabled={toggling === blog._id}
                      sx={{ color: blog.status === "published" ? "#f0b429" : "#00ff87" }}
                    >
                      {toggling === blog._id
                        ? <CircularProgress size={14} />
                        : blog.status === "published"
                          ? <UnpublishIcon sx={{ fontSize: 16 }} />
                          : <PublishIcon sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" component={Link} to={`/admin/blog/edit/${blog._id}`}
                      sx={{ color: theme.palette.text.secondary, "&:hover": { color: theme.palette.primary.main } }}>
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => setDeleteId(blog._id)}
                      sx={{ color: theme.palette.text.muted, "&:hover": { color: "#ff4d6d" } }}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      )}

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { background: theme.palette.background.card, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Delete Post?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            This is permanent and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
          <Button variant="contained" onClick={handleDelete} disabled={deleting}
            sx={{ background: "#ff4d6d", "&:hover": { background: "#e0334f" } }}>
            {deleting ? <CircularProgress size={16} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
