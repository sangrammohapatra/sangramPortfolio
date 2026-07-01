import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Skeleton, Chip,
  Divider, InputAdornment, useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import StarIcon from "@mui/icons-material/Star";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CachedIcon from "@mui/icons-material/Cached";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TechBadge from "./TechBadge";
import SkillTag from "./SkillTag";
import { useGitHubAnalysis } from "../hooks/useGitHubAnalysis";

// Language colour palette (GitHub-style)
const LANG_COLORS = {
  JavaScript:  "#F1E05A", TypeScript:  "#3178C6", Python:     "#3572A5",
  Go:          "#00ADD8", Java:        "#B07219", "C#":       "#178600",
  "C++":       "#F34B7D", PHP:         "#4F5D95", Ruby:       "#701516",
  Rust:        "#DEA584", Swift:       "#F05138", Kotlin:     "#A97BFF",
  CSS:         "#563D7C", HTML:        "#E34C26", Shell:      "#89E051",
  Dockerfile:  "#384D54", Vue:         "#41B883", Svelte:     "#FF3E00",
  Dart:        "#00B4AB", Scala:       "#C22D40", Haskell:    "#5E5086",
  Elixir:      "#6E4A7E", Clojure:     "#DB5855", Lua:        "#000080",
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || "#64748b";
}

function LanguageBar({ languages }) {
  if (!languages || typeof languages !== "object") return null;
  const entries = Object.entries(languages);
  if (!entries.length) return null;
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (!total) return null;
  const sorted = [...entries].sort(([, a], [, b]) => b - a).slice(0, 8);

  return (
    <Box>
      {/* Coloured bar */}
      <Box sx={{ display: "flex", borderRadius: "6px", overflow: "hidden", height: 8, mb: 1.5 }}>
        {sorted.map(([lang, bytes]) => (
          <Box
            key={lang}
            sx={{
              width: `${(bytes / total) * 100}%`,
              background: getLangColor(lang),
              transition: "width 0.6s ease",
            }}
          />
        ))}
      </Box>
      {/* Legend */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {sorted.map(([lang, bytes]) => (
          <Box key={lang} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: getLangColor(lang), flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", fontWeight: 600 }}>
              {lang}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "text.disabled" }}>
              {((bytes / total) * 100).toFixed(1)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function TechGroup({ label, items, color }) {
  if (!items?.length) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, flexWrap: "wrap" }}>
      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 800,
          color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          minWidth: 64,
          pt: 0.5,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, flex: 1 }}>
        {items.map((t) => <TechBadge key={t} name={t} />)}
      </Box>
    </Box>
  );
}

function ResultSkeleton() {
  return (
    <Box sx={{ mt: 3 }}>
      <Skeleton variant="rounded" height={48} sx={{ mb: 2, borderRadius: 2 }} />
      <Skeleton variant="rounded" height={8} sx={{ mb: 1.5, borderRadius: 1 }} />
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {[80, 60, 100, 50].map((w, i) => <Skeleton key={i} variant="rounded" width={w} height={18} sx={{ borderRadius: 2 }} />)}
      </Box>
      <Skeleton variant="rounded" height={28} sx={{ mb: 2, borderRadius: 2 }} />
      {[1, 2].map((i) => (
        <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
          {[90, 110, 80, 70].map((w, j) => <Skeleton key={j} variant="rounded" width={w} height={28} sx={{ borderRadius: 1 }} />)}
        </Box>
      ))}
      <Skeleton variant="rounded" height={28} sx={{ mt: 2, mb: 1.5, borderRadius: 2 }} />
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {[120, 100, 150, 90, 130].map((w, i) => <Skeleton key={i} variant="rounded" width={w} height={26} sx={{ borderRadius: "20px" }} />)}
      </Box>
    </Box>
  );
}

const DEMO_URLS = [
  "https://github.com/vercel/next.js",
  "https://github.com/facebook/react",
  "https://github.com/expressjs/express",
];

export default function GitHubAnalyzer() {
  const theme = useTheme();
  const { data, loading, error, analyze, reset } = useGitHubAnalysis();
  const [url, setUrl] = useState("");

  const primary = theme.palette.primary.main; // neon green
  const secondary = theme.palette.secondary?.main || "#f0b429";

  function handleSubmit(e) {
    e.preventDefault();
    if (url.trim()) analyze(url.trim());
  }

  function handleDemo(demoUrl) {
    setUrl(demoUrl);
    analyze(demoUrl);
  }

  function handleReset() {
    setUrl("");
    reset();
  }

  const ts = data?.analysis?.tech_stack || {};
  const allTechCount = [
    ...(ts.frontend || []),
    ...(ts.backend || []),
    ...(ts.database || []),
    ...(ts.devops || []),
    ...(data?.analysis?.ai_tools || []),
  ].length;

  return (
    <Box sx={{ mt: 10 }}>
      {/* Section heading */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: primary,
            mb: 1,
            textTransform: "uppercase",
          }}
        >
          Live Tool
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: "text.primary",
            lineHeight: 1.15,
            mb: 1,
          }}
        >
          GitHub Repo Analyzer
        </Typography>
        <Typography sx={{ fontSize: "0.9rem", color: "text.secondary", maxWidth: 520, lineHeight: 1.7 }}>
          Paste any public GitHub URL — AI reads the code, dependencies, and README to generate a
          full tech stack breakdown instantly.
        </Typography>
      </Box>

      {/* Main card */}
      <Box
        sx={{
          background: theme.palette.background.card,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <Box
          sx={{
            height: 3,
            background: `linear-gradient(90deg, ${primary}, ${secondary}, ${primary})`,
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
            "@keyframes shimmer": {
              "0%": { backgroundPosition: "200% 0" },
              "100%": { backgroundPosition: "-200% 0" },
            },
          }}
        />

        <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
          {/* Input form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="https://github.com/username/repository"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GitHubIcon sx={{ color: "text.disabled", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    background: theme.palette.background.elevated || "rgba(255,255,255,0.03)",
                    "& fieldset": { borderColor: theme.palette.divider },
                    "&:hover fieldset": { borderColor: `${primary}60` },
                    "&.Mui-focused fieldset": { borderColor: primary },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !url.trim()}
                startIcon={loading ? null : <SearchIcon fontSize="small" />}
                sx={{
                  minWidth: { xs: "100%", sm: 130 },
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  background: loading ? `${primary}60` : primary,
                  color: "#000",
                  boxShadow: loading ? "none" : `0 4px 20px ${primary}40`,
                  transition: "all 0.2s",
                  "&:hover": { background: primary, boxShadow: `0 6px 24px ${primary}55` },
                  "&:disabled": { background: `${primary}40`, color: "#00000080" },
                }}
              >
                {loading ? "Analyzing…" : "Analyze"}
              </Button>
            </Box>
          </form>

          {/* Demo URL chips */}
          {!data && !loading && !error && (
            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap", alignItems: "center" }}>
              <Typography sx={{ fontSize: "0.7rem", color: "text.disabled" }}>Try:</Typography>
              {DEMO_URLS.map((u) => {
                const name = u.replace("https://github.com/", "");
                return (
                  <Chip
                    key={u}
                    label={name}
                    size="small"
                    onClick={() => handleDemo(u)}
                    sx={{
                      fontSize: "0.67rem",
                      fontFamily: "monospace",
                      cursor: "pointer",
                      background: theme.palette.background.elevated || "rgba(255,255,255,0.05)",
                      border: `1px solid ${theme.palette.divider}`,
                      color: "text.secondary",
                      "&:hover": { borderColor: primary, color: primary },
                    }}
                  />
                );
              })}
            </Box>
          )}

          {/* Loading skeleton */}
          {loading && <ResultSkeleton />}

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Box
                  sx={{
                    mt: 3, p: 2, borderRadius: 2,
                    background: "#ef444412",
                    border: "1px solid #ef444430",
                    display: "flex", gap: 1.5, alignItems: "flex-start",
                  }}
                >
                  <WarningAmberIcon sx={{ color: "#ef4444", mt: 0.1, flexShrink: 0 }} fontSize="small" />
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#ef4444", mb: 0.3 }}>
                      Analysis failed
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "#f87171" }}>{error}</Typography>
                    <Button
                      size="small"
                      onClick={handleReset}
                      sx={{ mt: 1, color: "#ef4444", fontSize: "0.72rem", p: 0, minWidth: 0 }}
                    >
                      Try another URL
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {data && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

                {/* Repo header */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <GitHubIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography
                        component="a"
                        href={data.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: primary,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {data.repo_full_name}
                      </Typography>
                    </Box>
                    {data.github_data?.description && (
                      <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", maxWidth: 500 }}>
                        {data.github_data.description}
                      </Typography>
                    )}
                  </Box>

                  {/* Stats */}
                  <Box sx={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 15, color: secondary }} />
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: secondary }}>
                        {(data.github_data?.stars || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ForkRightIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                      <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                        {(data.github_data?.forks || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Language bar */}
                {data.github_data?.languages && Object.keys(data.github_data.languages).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{ fontSize: "0.65rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.5 }}
                    >
                      Languages
                    </Typography>
                    <LanguageBar languages={data.github_data.languages} />
                  </Box>
                )}

                {/* Topics */}
                {data.github_data?.topics?.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, mb: 3 }}>
                    {data.github_data.topics.map((t) => (
                      <Chip
                        key={t}
                        label={`#${t}`}
                        size="small"
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          background: `${primary}12`,
                          color: primary,
                          border: `1px solid ${primary}30`,
                          height: 22,
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Tech stack */}
                {allTechCount > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{ fontSize: "0.65rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase", mb: 2 }}
                    >
                      Tech Stack
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <TechGroup label="Frontend"  items={ts.frontend}  color="#60a5fa" />
                      <TechGroup label="Backend"   items={ts.backend}   color="#4ade80" />
                      <TechGroup label="Database"  items={ts.database}  color="#fbbf24" />
                      <TechGroup label="DevOps"    items={ts.devops}    color="#fb923c" />
                    </Box>
                  </Box>
                )}

                {/* AI Tools */}
                {data.analysis?.ai_tools?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <AutoAwesomeIcon sx={{ fontSize: 14, color: "#c084fc" }} />
                      <Typography
                        sx={{ fontSize: "0.65rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase" }}
                      >
                        AI Tools & Models
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                      {data.analysis.ai_tools.map((t) => <TechBadge key={t} name={t} />)}
                    </Box>
                  </Box>
                )}

                {/* Skills demonstrated */}
                {data.analysis?.skills_demonstrated?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{ fontSize: "0.65rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.5 }}
                    >
                      Skills Demonstrated
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                      {data.analysis.skills_demonstrated.map((s) => (
                        <SkillTag key={s} skill={s} showCategory />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Summary */}
                {data.analysis?.summary && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: `${primary}08`,
                      border: `1px solid ${primary}20`,
                      borderLeft: `3px solid ${primary}`,
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", lineHeight: 1.75, fontStyle: "italic" }}>
                      {data.analysis.summary}
                    </Typography>
                  </Box>
                )}

                {/* Footer meta */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    {data.cached ? (
                      <>
                        <CachedIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                        <Typography sx={{ fontSize: "0.67rem", color: "text.disabled" }}>
                          Served from cache · {new Date(data.analyzed_at).toLocaleDateString()}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon sx={{ fontSize: 13, color: "#4ade80" }} />
                        <Typography sx={{ fontSize: "0.67rem", color: "text.disabled" }}>
                          Fresh analysis completed
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Button
                    size="small"
                    onClick={handleReset}
                    sx={{ fontSize: "0.72rem", color: "text.disabled", "&:hover": { color: primary }, minWidth: 0, p: 0 }}
                  >
                    Analyze another →
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
