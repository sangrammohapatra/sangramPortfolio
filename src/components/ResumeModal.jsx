import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { profile } from "../data/profile";

export default function ResumeModal({ open, onClose }) {
  const theme = useTheme();
  const isPdf = profile.resumeUrl.toLowerCase().endsWith(".pdf");
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          m: { xs: 1, md: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          Resume Preview
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: { xs: "60vh", md: "75vh" } }}>
        {isPdf ? (
          <Box sx={{ width: "100%", height: "100%", background: "#222" }}>
            <iframe
              src={`${profile.resumeUrl}#toolbar=0`}
              title="Resume"
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
              px: 2,
            }}
          >
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}
            >
              Preview isn't available for this file type in-browser.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              href={profile.resumeUrl}
              target="_blank"
              startIcon={<OpenInNewIcon />}
            >
              Open in new tab
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <Button onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          href={profile.resumeUrl}
          download
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}
