import React, { useEffect } from "react";
import {
  Box, Typography, Skeleton, Chip, useTheme, IconButton, Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import StarIcon from "@mui/icons-material/Star";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CachedIcon from "@mui/icons-material/Cached";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TechBadge from "./TechBadge";
import SkillTag from "./SkillTag";
import { useGitHubAnalysis } from "../hooks/useGitHubAnalysis";

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
          fontSize: "0.65rem", fontWeight: 800, color,
          letterSpacing: "0.08em", textTransform: "uppercase",
          minWidth: 64, pt: 0.5, flexShrink: 0,
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

function InsightsSkeleton() {
  return (
    <Box>
      <Skeleton variant="rounded" height={8} sx={{ mb: 1.5, borderRadius: 1 }} />
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {[80, 60, 100, 50].map((w, i) => (
          <Skeleton key={i} variant="rounded" width={w} height={18} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
      <Skeleton variant="rounded" height={28} sx={{ mb: 2, borderRadius: 2 }} />
      {[1, 2].map((i) => (
        <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
          {[90, 110, 80, 70].map((w, j) => (
            <Skeleton key={j} variant="rounded" width={w} height={28} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      ))}
      <Skeleton variant="rounded" height={28} sx={{ mt: 2, mb: 1.5, borderRadius: 2 }} />
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {[120, 100, 150, 90, 130].map((w, i) => (
          <Skeleton key={i} variant="rounded" width={w} height={26} sx={{ borderRadius: "20px" }} />
        ))}
      </Box>
    </Box>
  );
}

export default function ProjectRepoInsights({ githubUrl, projectColor }) {
  const theme = useTheme();
  const { data, loading, error, analyze } = useGitHubAnalysis();
  const primary = projectColor || theme.palette.primary.main;
  const secondary = theme.palette.secondary?.main || "#f0b429";

  useEffect(() => {
    if (githubUrl) analyze(githubUrl);
  }, [githubUrl]);

  const ts = data?.analysis?.tech_stack || {};
  const allTechCount = [
    ...(ts.frontend || []),
    ...(ts.backend || []),
    ...(ts.database || []),
    ...(ts.devops || []),
    ...(data?.analysis?.ai_tools || []),
  ].length;

  return (
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

      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 15, color: primary }} />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: primary }}>
              AI Repo Analysis
            </Typography>
          </Box>
          {data && (
            <Typography
              component="a"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex", alignItems: "center", gap: 0.5,
                fontSize: "0.72rem", color: "text.disabled",
                textDecoration: "none",
                "&:hover": { color: primary },
              }}
            >
              <GitHubIcon sx={{ fontSize: 13 }} />
              {data.repo_full_name}
            </Typography>
          )}
        </Box>

        {/* Loading */}
        {loading && <InsightsSkeleton />}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box
                sx={{
                  p: 2, borderRadius: 2,
                  background: "#ef444412",
                  border: "1px solid #ef444430",
                  display: "flex", gap: 1.5, alignItems: "center",
                }}
              >
                <WarningAmberIcon sx={{ color: "#ef4444", flexShrink: 0 }} fontSize="small" />
                <Typography sx={{ fontSize: "0.8rem", color: "#f87171" }}>
                  Could not load repo insights
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Repo stats */}
              <Box sx={{ display: "flex", gap: 2, mb: 2.5, flexWrap: "wrap" }}>
                {data.github_data?.stars != null && (
                  <Tooltip title="GitHub stars" placement="top">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "default" }}>
                      <StarIcon sx={{ fontSize: 14, color: secondary }} />
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: secondary }}>
                        {(data.github_data.stars || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
                {data.github_data?.forks != null && (
                  <Tooltip title="Forks" placement="top">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "default" }}>
                      <ForkRightIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                      <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                        {(data.github_data.forks || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
                {data.github_data?.topics?.slice(0, 4).map((t) => (
                  <Tooltip key={t} title={`Topic: ${t}`} placement="top">
                    <Chip
                      label={`#${t}`}
                      size="small"
                      sx={{
                        fontSize: "0.62rem", fontWeight: 600, height: 20,
                        background: `${primary}12`, color: primary,
                        border: `1px solid ${primary}30`,
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>

              {/* Language bar */}
              {data.github_data?.languages && Object.keys(data.github_data.languages).length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{ fontSize: "0.62rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.2 }}
                  >
                    Languages
                  </Typography>
                  <LanguageBar languages={data.github_data.languages} />
                </Box>
              )}

              {/* Tech stack */}
              {allTechCount > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{ fontSize: "0.62rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.5 }}
                  >
                    Detected Tech Stack
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                    <TechGroup label="Frontend"  items={ts.frontend}  color="#60a5fa" />
                    <TechGroup label="Backend"   items={ts.backend}   color="#4ade80" />
                    <TechGroup label="Database"  items={ts.database}  color="#fbbf24" />
                    <TechGroup label="DevOps"    items={ts.devops}    color="#fb923c" />
                  </Box>
                </Box>
              )}

              {/* AI Tools */}
              {data.analysis?.ai_tools?.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 12, color: "#c084fc" }} />
                    <Typography
                      sx={{ fontSize: "0.62rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase" }}
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
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{ fontSize: "0.62rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.2 }}
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

              {/* AI Summary */}
              {data.analysis?.summary && (
                <Box
                  sx={{
                    p: 2, borderRadius: 2,
                    background: `${primary}08`,
                    border: `1px solid ${primary}20`,
                    borderLeft: `3px solid ${primary}`,
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", lineHeight: 1.8, fontStyle: "italic" }}>
                    {data.analysis.summary}
                  </Typography>
                </Box>
              )}

              {/* Footer meta */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                {data.cached ? (
                  <>
                    <CachedIcon sx={{ fontSize: 12, color: "text.disabled" }} />
                    <Typography sx={{ fontSize: "0.65rem", color: "text.disabled" }}>
                      Cached · {new Date(data.analyzed_at).toLocaleDateString()}
                    </Typography>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon sx={{ fontSize: 12, color: "#4ade80" }} />
                    <Typography sx={{ fontSize: "0.65rem", color: "text.disabled" }}>
                      Fresh analysis
                    </Typography>
                  </>
                )}
                <Tooltip title="Refresh analysis" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => analyze(githubUrl)}
                    disabled={loading}
                    sx={{
                      ml: 0.5, p: 0.3,
                      color: "text.disabled",
                      "&:hover": { color: primary },
                    }}
                  >
                    <RefreshIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
