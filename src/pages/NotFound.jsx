import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

export default function NotFound() {
  const theme = useTheme();
  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: theme.palette.background.default,
      px: 3, textAlign: "center",
    }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography sx={{
          fontFamily: "'Syne', sans-serif",
          fontSize: { xs: "6rem", md: "10rem" },
          fontWeight: 800,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: theme.palette.text.primary, mb: 1.5 }}>
          Page Not Found
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, mb: 4, maxWidth: 360 }}>
          Looks like this page took a wrong turn. Let's get you back to the portfolio.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
          size="large"
        >
          Back to Home
        </Button>
      </motion.div>
    </Box>
  );
}
