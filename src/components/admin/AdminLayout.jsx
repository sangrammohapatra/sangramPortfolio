import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Box, Typography, Button, Divider, useTheme, Avatar, Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { label: "Dashboard",   icon: <DashboardIcon />, href: "/admin/dashboard" },
  { label: "All Posts",   icon: <ArticleIcon />,   href: "/admin/blogs"     },
  { label: "New Post",    icon: <AddIcon />,        href: "/admin/blog/new"  },
];

export default function AdminLayout({ children }) {
  const theme    = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const sidebarW = 240;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: theme.palette.background.default }}>
      {/* Sidebar */}
      <Box sx={{
        width: sidebarW, flexShrink: 0,
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography sx={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "1.3rem", color: theme.palette.primary.main,
          }}>
            SM<span style={{ color: theme.palette.text.secondary, fontWeight: 400 }}>.admin</span>
          </Typography>
          <Chip
            label="Admin Panel"
            size="small"
            sx={{
              mt: 0.5, fontSize: "0.62rem", height: 18,
              background: `${theme.palette.primary.main}15`,
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}30`,
            }}
          />
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1, p: 2 }}>
          {NAV.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Box
                key={item.href}
                component={Link}
                to={item.href}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 2, py: 1.5, borderRadius: 2, mb: 0.5,
                  textDecoration: "none",
                  background: active ? `${theme.palette.primary.main}15` : "transparent",
                  borderLeft: active ? `3px solid ${theme.palette.primary.main}` : "3px solid transparent",
                  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: `${theme.palette.primary.main}08`,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
                {item.label}
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />

          <Box
            component="a" href="/" target="_blank"
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: 2, py: 1.5, borderRadius: 2,
              textDecoration: "none",
              color: theme.palette.text.secondary, fontSize: "0.875rem",
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            <OpenInNewIcon sx={{ fontSize: 18 }} />
            View Site
          </Box>
        </Box>

        {/* User */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Avatar sx={{
              width: 32, height: 32, fontSize: "0.8rem", fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: "#000",
            }}>
              {admin?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: theme.palette.text.primary }}>
                {admin?.username}
              </Typography>
              <Typography sx={{ fontSize: "0.68rem", color: theme.palette.text.muted }}>Administrator</Typography>
            </Box>
          </Box>
          <Button
            fullWidth size="small" startIcon={<LogoutIcon fontSize="small" />}
            onClick={handleLogout}
            sx={{
              color: theme.palette.text.secondary, fontSize: "0.78rem",
              justifyContent: "flex-start", px: 1.5,
              "&:hover": { color: "#ff4d6d", background: "rgba(255,77,109,0.08)" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, ml: `${sidebarW}px`, minHeight: "100vh", p: { xs: 3, md: 4 } }}>
        {children}
      </Box>
    </Box>
  );
}
