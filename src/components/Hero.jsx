import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  useTheme,
  Stack,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { profile } from "../data/profile";
import { fadeUp } from "../utils/motionVariants";
import ResumeModal from "./ResumeModal";
import ParticlesBackground from "./ParticlesBackground";
import MagneticButton from "./MagneticButton";

function GridBackground() {
  const theme = useTheme();
  const color =
    theme.palette.mode === "dark"
      ? "rgba(0,255,135,0.04)"
      : "rgba(0,168,85,0.05)";
  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(0,255,135,0.06) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,168,85,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </Box>
  );
}

export default function Hero() {
  const theme = useTheme();
  const [resumeOpen, setResumeOpen] = useState(false);
  const { scrollY } = useScroll();

  // Parallax layers — different speeds create depth
  const nameY     = useTransform(scrollY, [0, 600], [0, -55]);
  const subtitleY = useTransform(scrollY, [0, 600], [0, -80]);
  const avatarY   = useTransform(scrollY, [0, 600], [0, -38]);

  const handleContact = () =>
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Box
        id="hero"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: theme.palette.background.default,
          pt: { xs: 10, md: 0 },
        }}
      >
        <GridBackground />
        <ParticlesBackground variant="hero" />
        <Box
          sx={{
            maxWidth: 1200,
            width: "100%",
            mx: "auto",
            py: { xs: 8, md: 12 },
            px: { xs: 3, md: 6 },
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            alignItems: "center",
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* Left */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <Chip
                label="Available for opportunities"
                size="small"
                sx={{
                  mb: 3,
                  background: "rgba(0,255,135,0.08)",
                  color: theme.palette.primary.main,
                  border: "1px solid rgba(0,255,135,0.25)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.05em",
                  "& .MuiChip-label": { px: 1.5 },
                }}
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              style={{ y: nameY }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.2rem" },
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Sangram
                <br />
                <span style={{ color: theme.palette.primary.main }}>
                  Mohapatra
                </span>
              </Typography>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              style={{ y: subtitleY }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  mb: 1,
                  minHeight: 32,
                }}
              >
                <TypeAnimation
                  sequence={[
                    "Building enterprise-grade products.",
                    2000,
                    "React + Node.js + SAP S/4HANA.",
                    2000,
                    "Full-stack. Ownership-driven.",
                    2000,
                    "Shipping software that matters.",
                    2000,
                  ]}
                  repeat={Infinity}
                  style={{ color: theme.palette.secondary.main }}
                />
              </Typography>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              style={{ y: subtitleY }}
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: theme.palette.text.secondary,
                  maxWidth: 500,
                  lineHeight: 1.75,
                  mb: 4,
                }}
              >
                Software Engineer @ Incture Technologies · 2+ years building
                scalable supply chain platforms · 4 enterprise clients shipped.
              </Typography>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <MagneticButton>
                  <Button
                    variant="contained"
                    startIcon={<EmailIcon />}
                    onClick={handleContact}
                    size="large"
                    sx={{ fontSize: "0.95rem" }}
                  >
                    Get in Touch
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    size="large"
                    onClick={() => setResumeOpen(true)}
                    sx={{
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      "&:hover": { borderColor: theme.palette.primary.main },
                      fontSize: "0.95rem",
                    }}
                  >
                    View Resume
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button
                    variant="text"
                    startIcon={<DownloadIcon />}
                    href={profile.resumeUrl}
                    download
                    size="large"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Download
                  </Button>
                </MagneticButton>
              </Stack>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
            >
              <Stack direction="row" spacing={1.5}>
                {[
                  {
                    icon: <LinkedInIcon />,
                    href: profile.social.linkedin,
                    label: "LinkedIn",
                  },
                  {
                    icon: <GitHubIcon />,
                    href: profile.social.github,
                    label: "GitHub",
                  },
                ].map((s) => (
                  <IconChip key={s.label} {...s} theme={theme} />
                ))}
              </Stack>
            </motion.div>
          </Box>

          {/* Right — Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: avatarY }}
          >
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box
                sx={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00ff87, #f0b429)",
                  opacity: 0.3,
                  filter: "blur(20px)",
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: -3,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00ff87, #f0b429)",
                  zIndex: 0,
                }}
              />
              <Avatar
                src="/profile.png"
                alt="Sangram Mohapatra"
                sx={{
                  width: { xs: 200, md: 260 },
                  height: { xs: 200, md: 260 },
                  fontSize: "5rem",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  background: theme.palette.background.card,
                  border: `4px solid ${theme.palette.background.default}`,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                SM
              </Avatar>
            </Box>
          </motion.div>
        </Box>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            translateX: "-50%",
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Box
            sx={{
              width: 24,
              height: 38,
              borderRadius: 12,
              border: `2px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              pt: 0.8,
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 8,
                borderRadius: 2,
                background: theme.palette.primary.main,
              }}
            />
          </Box>
        </motion.div>
      </Box>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}

function IconChip({ icon, href, label, theme }) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        px: 2,
        py: 0.8,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.secondary,
        textDecoration: "none",
        fontSize: "0.85rem",
        fontWeight: 500,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          background: `${theme.palette.primary.main}08`,
        },
      }}
    >
      {React.cloneElement(icon, { fontSize: "small" })}
      {label}
    </Box>
  );
}
