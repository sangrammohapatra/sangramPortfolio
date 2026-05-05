import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const theme = useTheme();

  if (loading) return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: theme.palette.background.default }}>
      <CircularProgress sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
