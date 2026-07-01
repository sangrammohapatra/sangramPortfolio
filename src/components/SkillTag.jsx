import React from "react";
import { Box, Tooltip } from "@mui/material";

// Keyword → category
const SKILL_CATEGORIES = {
  // AI / ML
  "ai": "ai", "machine learning": "ai", "deep learning": "ai", "nlp": "ai",
  "prompt engineering": "ai", "rag": "ai", "llm": "ai", "generative ai": "ai",
  "computer vision": "ai", "ai integration": "ai", "vector database": "ai",
  "embedding": "ai", "fine-tuning": "ai", "rag architecture": "ai",
  "ai-powered": "ai", "llm integration": "ai",

  // Frontend / UI
  "state management": "frontend", "component architecture": "frontend",
  "responsive ui": "frontend", "responsive design": "frontend",
  "server-side rendering": "frontend", "ssr": "frontend", "ssg": "frontend",
  "ssr/ssg": "frontend", "spa development": "frontend", "ui/ux": "frontend",
  "ui design": "frontend", "animation": "frontend", "drag and drop": "frontend",
  "accessibility": "frontend", "progressive web app": "frontend", "pwa": "frontend",
  "micro-frontends": "frontend", "design systems": "frontend",
  "code splitting": "frontend", "lazy loading": "frontend",

  // Backend / API
  "rest api design": "backend", "rest api": "backend", "api design": "backend",
  "graphql api": "backend", "microservices": "backend", "websockets": "backend",
  "real-time communication": "backend", "server-sent events": "backend",
  "event-driven": "backend", "background jobs": "backend", "caching": "backend",
  "api gateway": "backend", "grpc": "backend", "message queue": "backend",
  "webhooks": "backend", "rate limiting": "backend",

  // Auth / Security
  "authentication": "security", "authorization": "security",
  "jwt authentication": "security", "jwt": "security", "oauth": "security",
  "oauth 2.0": "security", "role-based access control": "security",
  "rbac": "security", "session management": "security", "encryption": "security",
  "csrf protection": "security", "input validation": "security",

  // Database
  "database schema design": "database", "data modeling": "database",
  "database design": "database", "orm/odm": "database", "migrations": "database",
  "full-text search": "database", "indexing": "database", "transactions": "database",
  "aggregation pipeline": "database", "query optimization": "database",

  // DevOps / Infra
  "ci/cd": "devops", "ci/cd pipeline": "devops", "containerization": "devops",
  "deployment": "devops", "infrastructure as code": "devops",
  "monitoring": "devops", "logging": "devops", "observability": "devops",
  "cloud infrastructure": "devops", "load balancing": "devops",
  "auto-scaling": "devops", "zero-downtime deployment": "devops",
};

const CATEGORY_STYLES = {
  ai:       { color: "#c084fc", bg: "#7c3aed" },
  frontend: { color: "#60a5fa", bg: "#1d4ed8" },
  backend:  { color: "#4ade80", bg: "#15803d" },
  security: { color: "#f87171", bg: "#b91c1c" },
  database: { color: "#fbbf24", bg: "#b45309" },
  devops:   { color: "#fb923c", bg: "#c2410c" },
  default:  { color: "#94a3b8", bg: "#334155" },
};

const CATEGORY_LABELS = {
  ai: "AI",
  frontend: "UI",
  backend: "API",
  security: "Auth",
  database: "DB",
  devops: "Ops",
};

function getCategory(skill) {
  const lower = skill.toLowerCase().trim();
  return SKILL_CATEGORIES[lower] || "default";
}

export default function SkillTag({ skill, showCategory = false }) {
  const category = getCategory(skill);
  const { color, bg } = CATEGORY_STYLES[category];
  const label = CATEGORY_LABELS[category];

  return (
    <Tooltip
      title={label ? `Category: ${category.toUpperCase()}` : ""}
      placement="top"
      arrow
      disableHoverListener={!showCategory && !label}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.2,
          py: 0.45,
          borderRadius: "20px",
          border: `1px solid ${color}45`,
          background: `${bg}18`,
          cursor: "default",
          transition: "all 0.2s ease",
          "&:hover": {
            background: `${bg}30`,
            borderColor: `${color}80`,
            boxShadow: `0 0 14px ${color}40, 0 0 4px ${color}20`,
            transform: "translateY(-1px)",
          },
        }}
      >
        {showCategory && label && (
          <Box
            sx={{
              fontSize: "0.58rem",
              fontWeight: 800,
              color: bg,
              background: color,
              px: 0.5,
              py: 0.1,
              borderRadius: "4px",
              lineHeight: 1.4,
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </Box>
        )}
        <Box
          sx={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color,
            letterSpacing: "0.02em",
            fontFamily: "'Syne', 'Inter', sans-serif",
          }}
        >
          {skill}
        </Box>
      </Box>
    </Tooltip>
  );
}
