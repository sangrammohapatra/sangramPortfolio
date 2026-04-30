import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Box, IconButton, Button,
  Drawer, List, ListItemButton, ListItemText, useMediaQuery, useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/WbSunny";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ toggleMode, mode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (href) => {
    setDrawerOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? theme.palette.mode === "dark"
              ? "rgba(6,11,24,0.92)"
              : "rgba(240,244,255,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Typography
            component="a"
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNav("#hero"); }}
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
            SM<span style={{ color: theme.palette.text.secondary, fontWeight: 400 }}>.dev</span>
          </Typography>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    "&:hover": { color: theme.palette.primary.main, background: "transparent" },
                  }}
                >
                  {link.label}
                </Button>
              ))}
              <IconButton onClick={toggleMode} sx={{ ml: 1, color: theme.palette.text.secondary }}>
                {mode === "dark" ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={toggleMode} size="small" sx={{ color: theme.palette.text.secondary }}>
                {mode === "dark" ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: theme.palette.text.primary }}>
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
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.label}
              onClick={() => handleNav(link.href)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
