import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography, TextField, Button, Chip, Alert,
  CircularProgress, Paper, Grid, FormControl,
  InputLabel, Select, MenuItem, useTheme,
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminBlogAPI } from "../../services/api";

const COLOR_OPTIONS = [
  "#00ff87", "#f0b429", "#ff4d6d", "#06d6c7",
  "#a78bfa", "#fb923c", "#34d399", "#60a5fa",
];

export default function AdminBlogEditor() {
  const theme    = useTheme();
  const navigate = useNavigate();
  const { id }   = useParams(); // present = edit mode
  const isEdit   = !!id;

  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", tags: [],
    coverColor: "#00ff87", status: "draft",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError]       = useState("");
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminBlogAPI.getById(id)
      .then((blog) => setForm({
        title:      blog.title,
        excerpt:    blog.excerpt,
        content:    blog.content,
        tags:       blog.tags || [],
        coverColor: blog.coverColor || "#00ff87",
        status:     blog.status,
      }))
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };
  const removeTag = (tag) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSave = async (publishOverride) => {
    if (!form.title || !form.content) {
      setError("Title and content are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = { ...form };
      if (publishOverride) payload.status = "published";

      if (isEdit) {
        await adminBlogAPI.update(id, payload);
      } else {
        await adminBlogAPI.create(payload);
      }
      setSaved(true);
      setTimeout(() => navigate("/admin/blogs"), 1000);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      background: theme.palette.background.elevated,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset, &.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
  };

  if (fetching) {
    return (
      <AdminLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button component={Link} to="/admin/blogs" startIcon={<ArrowBackIcon />}
            sx={{ color: theme.palette.text.secondary, minWidth: 0 }}>
            Back
          </Button>
          <Typography variant="h5" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: theme.palette.text.primary }}>
            {isEdit ? "Edit Post" : "New Post"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined" startIcon={<SaveIcon />}
            onClick={() => handleSave(false)} disabled={loading}
            sx={{ borderColor: theme.palette.divider, color: theme.palette.text.secondary }}
          >
            Save Draft
          </Button>
          <Button
            variant="contained" startIcon={<PublishIcon />}
            onClick={() => handleSave(true)} disabled={loading}
            endIcon={loading && <CircularProgress size={14} color="inherit" />}
          >
            {form.status === "published" ? "Update" : "Publish"}
          </Button>
        </Box>
      </Box>

      {error  && <Alert severity="error"   sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>}
      {saved  && <Alert severity="success" sx={{ mb: 3 }}>Saved! Redirecting…</Alert>}

      <Grid container spacing={3}>
        {/* Left — editor */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth label="Post Title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              sx={inputSx}
              InputProps={{ sx: { fontSize: "1.1rem", fontWeight: 700 } }}
            />
            <TextField
              fullWidth multiline rows={2} label="Excerpt (short description)"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              sx={inputSx}
            />

            {/* WYSIWYG MD Editor */}
            <Box>
              <Typography sx={{ fontSize: "0.78rem", color: theme.palette.text.muted, mb: 1, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                Content
              </Typography>
              <Box data-color-mode={theme.palette.mode} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${theme.palette.divider}` }}>
                <MDEditor
                  value={form.content}
                  onChange={(v) => setForm({ ...form, content: v || "" })}
                  height={480}
                  preview="live"
                />
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right — settings */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, position: { lg: "sticky" }, top: { lg: 24 } }}>
            {/* Status */}
            <Paper sx={{ p: 2.5, background: theme.palette.background.card, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.palette.text.muted, mb: 1.5 }}>
                Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  sx={{
                    background: theme.palette.background.elevated,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
                  }}
                >
                  <MenuItem value="draft">📝 Draft</MenuItem>
                  <MenuItem value="published">✅ Published</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Tags */}
            <Paper sx={{ p: 2.5, background: theme.palette.background.card, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.palette.text.muted, mb: 1.5 }}>
                Tags
              </Typography>
              <TextField
                size="small" fullWidth placeholder="Type tag + Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                sx={{ ...inputSx, mb: 1.5 }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                {form.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" onDelete={() => removeTag(tag)}
                    sx={{
                      background: `${theme.palette.primary.main}12`,
                      color: theme.palette.primary.main,
                      border: `1px solid ${theme.palette.primary.main}30`,
                      fontWeight: 600, fontSize: "0.7rem",
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Cover colour */}
            <Paper sx={{ p: 2.5, background: theme.palette.background.card, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.palette.text.muted, mb: 1.5 }}>
                Cover Colour
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {COLOR_OPTIONS.map((c) => (
                  <Box
                    key={c}
                    onClick={() => setForm({ ...form, coverColor: c })}
                    sx={{
                      width: 28, height: 28, borderRadius: "50%", background: c,
                      cursor: "pointer",
                      border: form.coverColor === c ? `3px solid ${theme.palette.text.primary}` : "3px solid transparent",
                      boxShadow: form.coverColor === c ? `0 0 0 2px ${c}` : "none",
                      transition: "all 0.15s",
                      "&:hover": { transform: "scale(1.15)" },
                    }}
                  />
                ))}
              </Box>
              {/* Preview */}
              <Box sx={{
                mt: 2, height: 6, borderRadius: 3,
                background: `linear-gradient(90deg, ${form.coverColor}, ${form.coverColor}66)`,
              }} />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
