import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/WbSunny";
import { motion } from "framer-motion";
import { profile } from "../data/profile";
import { Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
  { label: "Admin Login", href: "/admin/login" },
];

// Section IDs to observe for active highlight
const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""));

export default function Navbar({ toggleMode, mode, visible }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  // Banner offset — if open-to-work banner visible add ~32px
  const bannerH = visible ? 32 : 0;

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Intersection Observer — active section
  useEffect(() => {
    const observers = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (href) => {
    setDrawerOpen(false);
    if(href.includes("/admin/login")) {
      navigate("/admin/login");
      return;
    }
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLogin = () => {
    navigate("/admin/login");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: bannerH,
          background: scrolled
            ? theme.palette.mode === "dark"
              ? "rgba(5,5,5,0.92)"
              : "rgba(240,255,244,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${theme.palette.divider}`
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Logo */}
          <Typography
            component="a"
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNav("#hero");
            }}
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: theme.palette.primary.main,
              textDecoration: "none",
              letterSpacing: "-0.02em",
              flexGrow: 1,
            }}
          >
            SM
            <span
              style={{ color: theme.palette.text.secondary, fontWeight: 400 }}
            >
              .dev
            </span>
          </Typography>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href.replace("#", "");
                return (
                  <Box key={link.label} sx={{ position: "relative" }}>
                    <Button
                      onClick={() => handleNav(link.href)}
                      sx={{
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 700 : 500,
                        "&:hover": {
                          color: theme.palette.primary.main,
                          background: "transparent",
                        },
                        transition: "color 0.2s",
                      }}
                    >
                      {link.label}
                    </Button>
                    {/* Active underline dot */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: "absolute",
                          bottom: 4,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: theme.palette.primary.main,
                          boxShadow: `0 0 8px ${theme.palette.primary.main}`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
              <IconButton
                onClick={toggleMode}
                sx={{ ml: 1, color: theme.palette.text.secondary }}
              >
                {mode === "dark" ? (
                  <Brightness7Icon fontSize="small" />
                ) : (
                  <Brightness4Icon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                onClick={handleLogin}
                sx={{ ml: 1, color: theme.palette.text.secondary }}
              >
                <Login fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={toggleMode}
                size="small"
                sx={{ color: theme.palette.text.secondary }}
              >
                {mode === "dark" ? (
                  <Brightness7Icon fontSize="small" />
                ) : (
                  <Brightness4Icon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: theme.palette.background.paper,
            borderLeft: `1px solid ${theme.palette.divider}`,
            p: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.replace("#", "");
            return (
              <ListItemButton
                key={link.label}
                onClick={() => handleNav(link.href)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  background: isActive
                    ? `${theme.palette.primary.main}12`
                    : "transparent",
                  borderLeft: isActive
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
