import React, { useState, useRef } from "react";
import {
  Box, Typography, Grid, Paper, TextField, Button,
  Alert, Snackbar, useTheme, CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import emailjs from "emailjs-com";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { profile } from "../data/profile";
import { fadeUp } from "../utils/motionVariants";

// ─── EmailJS credentials are read from .env ──────────────────────────────────
// To configure: copy .env.example → .env and fill in your EmailJS keys.
// See README.md for full setup instructions.
// Vite exposes env vars via import.meta.env (prefixed with VITE_)
// Set these in your .env file — see .env.example for setup instructions
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const contactInfo = [
  { icon: <EmailIcon />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: <PhoneIcon />, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
  { icon: <LocationOnIcon />, label: "Location", value: profile.location, href: null },
];

const socialLinks = [
  { icon: <LinkedInIcon />, href: profile.social.linkedin, label: "LinkedIn", color: "#0A66C2" },
  { icon: <GitHubIcon />, href: profile.social.github, label: "GitHub", color: "#6e5494" },
  { icon: <WhatsAppIcon />, href: profile.social.whatsapp, label: "WhatsApp", color: "#25D366" },
  { icon: <InstagramIcon />, href: profile.social.instagram, label: "Instagram", color: "#E1306C" },
  { icon: <FacebookIcon />, href: profile.social.facebook, label: "Facebook", color: "#1877F2" },
];

export default function Contact() {
  const theme = useTheme();
  const { ref, isInView } = useScrollAnimation();
  const formRef = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setSnack({ open: true, msg: "Message sent! I'll get back to you soon 🎉", severity: "success" });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSnack({ open: true, msg: "Failed to send. Please email me directly.", severity: "error" });
    }
    setLoading(false);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      background: theme.palette.background.elevated,
      borderRadius: 2,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.primary.main },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
  };

  return (
    <SectionWrapper id="contact" title="Get in Touch" subtitle="CONTACT">
      <Box ref={ref}>
        <Grid container spacing={5}>
          {/* Left — Info */}
          <Grid item xs={12} md={4}>
            <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={0}>
              <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 4, fontSize: "0.95rem" }}>
                I'm always open to new opportunities, collaborations, or just a good engineering conversation. Drop me a message — I usually respond within 24 hours.
              </Typography>

              {/* Contact details */}
              <Box sx={{ mb: 4 }}>
                {contactInfo.map((info) => (
                  <Box key={info.label} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: 2,
                      background: "rgba(0,255,135,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: theme.palette.primary.main,
                    }}>
                      {React.cloneElement(info.icon, { fontSize: "small" })}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.muted, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.1 }}>
                        {info.label}
                      </Typography>
                      <Typography
                        component={info.href ? "a" : "span"}
                        href={info.href}
                        sx={{ fontSize: "0.875rem", color: theme.palette.text.primary, textDecoration: "none", fontWeight: 500, "&:hover": { color: theme.palette.primary.main } }}
                      >
                        {info.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Social */}
              <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.muted, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>
                Find me on
              </Typography>
              <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
                {socialLinks.map((s) => (
                  <Box
                    key={s.label}
                    component="a"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    sx={{
                      width: 40, height: 40, borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: theme.palette.text.secondary,
                      transition: "all 0.2s",
                      "&:hover": { borderColor: s.color, color: s.color, background: `${s.color}10`, transform: "translateY(-2px)" },
                    }}
                  >
                    {React.cloneElement(s.icon, { fontSize: "small" })}
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Right — Form */}
          <Grid item xs={12} md={8}>
            <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} custom={1}>
              <Paper sx={{
                p: { xs: 3, md: 4.5 },
                background: theme.palette.background.card,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
              }}>
                <Box component="form" ref={formRef} onSubmit={handleSubmit}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Your Name" name="name" value={form.name} onChange={handleChange} required sx={inputSx} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required sx={inputSx} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} sx={inputSx} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth multiline rows={5}
                        label="Message" name="message"
                        value={form.message} onChange={handleChange}
                        required sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                        disabled={loading}
                        sx={{ px: 4, fontSize: "0.95rem" }}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} sx={{ fontWeight: 600 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </SectionWrapper>
  );
}
