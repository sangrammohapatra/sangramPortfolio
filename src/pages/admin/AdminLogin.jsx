import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import { Login, Logout } from "@mui/icons-material";

export default function AdminLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      background: theme.palette.background.elevated,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.primary.main },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        background: theme.palette.background.default,
      }}
    >
      {/* Background glow */}
      <Box
        sx={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          pointerEvents: "none",
          background: `radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Paper
          sx={{
            p: { xs: 4, md: 5 },
            background: theme.palette.background.card,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        >
          {/* Icon */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                mx: "auto",
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockOutlinedIcon sx={{ color: "#000", fontSize: 24 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                color: theme.palette.text.primary,
              }}
            >
              Admin Login
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: theme.palette.text.secondary,
                mt: 0.5,
              }}
            >
              Portfolio management dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              sx={{ ...inputSx, mb: 2.5 }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              sx={{ ...inputSx, mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPw(!showPw)}>
                      {showPw ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              endIcon={
                loading && <CircularProgress size={16} color="inherit" />
              }
              sx={{ fontSize: "0.95rem", py: 1.5 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </Paper>

        <Button
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
            mt: 3,
            fontSize: "0.82rem",
            color: theme.palette.text.muted,
            textDecoration: "none",
            "&:hover": { color: theme.palette.primary.main },
          }}
          startIcon={<Logout fontSize="small" />}
        >
          Back to Home
        </Button>
      </motion.div>
    </Box>
  );
}
