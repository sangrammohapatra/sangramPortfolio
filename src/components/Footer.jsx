import React from "react";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import { profile } from "../data/profile";
import ReusableSocialButton from "./SocialHandleButton";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL = [
  { icon: <LinkedInIcon />, href: profile.social.linkedin, label: "LinkedIn", color: "#0A66C2", username: "@sangram-mohapatra", about: "500+ connections" },
  { icon: <GitHubIcon />, href: profile.social.github, label: "GitHub", color: "#6e5494", username: "@sangrammohapatra", about: "Check out my repos" },
  { icon: <EmailIcon />, href: `mailto:${profile.email}`, label: "Email", color: "#00ff87", username: profile.email, about: "Drop me a message" },
  { icon: <WhatsAppIcon />, href: profile.social.whatsapp, label: "WhatsApp", color: "#25D366", username: profile.phone, about: "Let's chat" },
  { icon: <InstagramIcon />, href: profile.social.instagram, label: "Instagram", color: "#E1306C", username: "@sangramm.__", about: "Photos & moments" },
  { icon: <FacebookIcon />, href: profile.social.facebook, label: "Facebook", color: "#1877F2", username: "sangram.mohapatra.1426", about: "Connect with me" },
];

export default function Footer() {
  const theme = useTheme();
  const year = new Date().getFullYear();

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        background: theme.palette.mode === "dark" ? "#040810" : theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 6, pb: 4,
        px: { xs: 3, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 4, gap: 3 }}>
          {/* Brand */}
          <Box>
            <Typography sx={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "1.5rem", color: theme.palette.primary.main,
              letterSpacing: "-0.02em", mb: 0.5,
            }}>
              SM<span style={{ color: theme.palette.text.secondary, fontWeight: 400 }}>.dev</span>
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: theme.palette.text.muted }}>
              Software Engineer · React · Node.js · SAP S/4HANA
            </Typography>
          </Box>

          {/* Nav */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {NAV.map((n) => (
              <Box
                key={n.label}
                component="button"
                onClick={() => scrollTo(n.href)}
                sx={{
                  background: "transparent", border: "none", cursor: "pointer",
                  px: 1.5, py: 0.5, borderRadius: 1,
                  fontSize: "0.82rem", fontWeight: 500,
                  color: theme.palette.text.secondary,
                  "&:hover": { color: theme.palette.primary.main },
                  transition: "color 0.2s",
                }}
              >
                {n.label}
              </Box>
            ))}
          </Box>

          {/* Social */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {SOCIAL.map((s) => (
              <ReusableSocialButton
                key={s.label}
                href={s.href}
                label={s.label}
                icon={s.icon}
                color={s.color}
                username={s.username}
                about={s.about}
                size={40}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: "0.78rem", color: theme.palette.text.muted }}>
            © {year} Sangram Mohapatra. All rights reserved.
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: theme.palette.text.muted }}>
            Built with React · MUI · Framer Motion · Claude
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
