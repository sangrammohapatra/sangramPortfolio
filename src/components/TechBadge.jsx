import React from "react";
import { Box, Tooltip } from "@mui/material";
import {
  SiReact, SiNodedotjs, SiMongodb, SiTypescript, SiJavascript,
  SiPython, SiDocker, SiKubernetes, SiGit, SiGithub, SiRedux,
  SiGraphql, SiFirebase, SiPostgresql, SiMysql, SiRedis,
  SiStripe, SiVercel, SiNetlify, SiTailwindcss, SiVite,
  SiTensorflow, SiAngular, SiVuedotjs, SiNextdotjs,
  SiExpress, SiSocketdotio, SiSupabase, SiPrisma, SiDjango,
  SiFlask, SiRust, SiGo, SiPhp, SiSwift, SiKotlin, SiSass,
  SiCss, SiHtml5, SiLinux, SiGooglecloud, SiJest,
  SiWebpack, SiRailway, SiRender, SiPytorch, SiSqlite,
} from "react-icons/si";

// Tech name → { icon component, brand color }
const ICON_MAP = {
  // Frontend frameworks
  react:            { Icon: SiReact,       color: "#61DAFB" },
  reactjs:          { Icon: SiReact,       color: "#61DAFB" },
  "react.js":       { Icon: SiReact,       color: "#61DAFB" },
  "next.js":        { Icon: SiNextdotjs,   color: "#E2E8F0" },
  nextjs:           { Icon: SiNextdotjs,   color: "#E2E8F0" },
  "vue.js":         { Icon: SiVuedotjs,    color: "#4FC08D" },
  vuejs:            { Icon: SiVuedotjs,    color: "#4FC08D" },
  vue:              { Icon: SiVuedotjs,    color: "#4FC08D" },
  angular:          { Icon: SiAngular,     color: "#DD0031" },
  tailwind:         { Icon: SiTailwindcss, color: "#06B6D4" },
  "tailwind css":   { Icon: SiTailwindcss, color: "#06B6D4" },
  tailwindcss:      { Icon: SiTailwindcss, color: "#06B6D4" },
  sass:             { Icon: SiSass,        color: "#CC6699" },
  scss:             { Icon: SiSass,        color: "#CC6699" },
  css:              { Icon: SiCss,         color: "#1572B6" },
  "css3":           { Icon: SiCss,         color: "#1572B6" },
  html:             { Icon: SiHtml5,       color: "#E34F26" },
  "html5":          { Icon: SiHtml5,       color: "#E34F26" },
  redux:            { Icon: SiRedux,       color: "#764ABC" },
  vite:             { Icon: SiVite,        color: "#646CFF" },
  webpack:          { Icon: SiWebpack,     color: "#8DD6F9" },
  graphql:          { Icon: SiGraphql,     color: "#E10098" },

  // Backend
  "node.js":        { Icon: SiNodedotjs,   color: "#339933" },
  nodejs:           { Icon: SiNodedotjs,   color: "#339933" },
  node:             { Icon: SiNodedotjs,   color: "#339933" },
  express:          { Icon: SiExpress,     color: "#E2E8F0" },
  "express.js":     { Icon: SiExpress,     color: "#E2E8F0" },
  expressjs:        { Icon: SiExpress,     color: "#E2E8F0" },
  django:           { Icon: SiDjango,      color: "#092E20" },
  flask:            { Icon: SiFlask,       color: "#E2E8F0" },
  "socket.io":      { Icon: SiSocketdotio, color: "#E2E8F0" },
  socketio:         { Icon: SiSocketdotio, color: "#E2E8F0" },

  // Languages
  typescript:       { Icon: SiTypescript,  color: "#3178C6" },
  javascript:       { Icon: SiJavascript,  color: "#F7DF1E" },
  python:           { Icon: SiPython,      color: "#3776AB" },
  rust:             { Icon: SiRust,        color: "#CE422B" },
  go:               { Icon: SiGo,          color: "#00ADD8" },
  golang:           { Icon: SiGo,          color: "#00ADD8" },
  php:              { Icon: SiPhp,         color: "#777BB4" },
  swift:            { Icon: SiSwift,       color: "#FA7343" },
  kotlin:           { Icon: SiKotlin,      color: "#7F52FF" },

  // Databases
  mongodb:          { Icon: SiMongodb,     color: "#47A248" },
  mongoose:         { Icon: SiMongodb,     color: "#47A248" },
  postgresql:       { Icon: SiPostgresql,  color: "#4169E1" },
  postgres:         { Icon: SiPostgresql,  color: "#4169E1" },
  mysql:            { Icon: SiMysql,       color: "#4479A1" },
  redis:            { Icon: SiRedis,       color: "#DC382D" },
  sqlite:           { Icon: SiSqlite,      color: "#003B57" },
  firebase:         { Icon: SiFirebase,    color: "#FFCA28" },
  supabase:         { Icon: SiSupabase,    color: "#3ECF8E" },
  prisma:           { Icon: SiPrisma,      color: "#5A67D8" },

  // DevOps / Cloud
  docker:           { Icon: SiDocker,      color: "#2496ED" },
  kubernetes:       { Icon: SiKubernetes,  color: "#326CE5" },
  aws:              { Icon: null,           color: "#FF9900" },
  "amazon web services": { Icon: null,    color: "#FF9900" },
  "aws lambda":     { Icon: null,          color: "#FF9900" },
  gcp:              { Icon: SiGooglecloud, color: "#4285F4" },
  "google cloud":   { Icon: SiGooglecloud, color: "#4285F4" },
  vercel:           { Icon: SiVercel,      color: "#E2E8F0" },
  netlify:          { Icon: SiNetlify,     color: "#00C7B7" },
  railway:          { Icon: SiRailway,     color: "#E2E8F0" },
  render:           { Icon: SiRender,      color: "#46E3B7" },
  linux:            { Icon: SiLinux,       color: "#FCC624" },
  git:              { Icon: SiGit,         color: "#F05032" },
  github:           { Icon: SiGithub,      color: "#E2E8F0" },
  jest:             { Icon: SiJest,        color: "#C21325" },

  // AI / ML
  openai:           { Icon: null,          color: "#74AA9C" },
  chatgpt:          { Icon: null,          color: "#74AA9C" },
  langchain:        { Icon: null,          color: "#1C3C3C" },
  huggingface:      { Icon: null,          color: "#FFD21E" },
  "hugging face":   { Icon: null,          color: "#FFD21E" },
  anthropic:        { Icon: null,          color: "#CC785C" },
  gemini:           { Icon: null,          color: "#4285F4" },
  tensorflow:       { Icon: SiTensorflow,  color: "#FF6F00" },
  pytorch:          { Icon: SiPytorch,     color: "#EE4C2C" },
  stripe:           { Icon: SiStripe,      color: "#008CDD" },
};

function normalize(name) {
  return name.toLowerCase().trim();
}

// Generate a deterministic color from a string (for unknown techs)
function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 60%)`;
}

export default function TechBadge({ name, size = "md" }) {
  const key = normalize(name);
  const mapping = ICON_MAP[key];
  const color = mapping ? mapping.color : hashColor(name);
  const IconComponent = mapping?.Icon;

  const iconSize = size === "sm" ? 13 : 16;
  const fontSize = size === "sm" ? "0.65rem" : "0.72rem";
  const px = size === "sm" ? 1 : 1.2;
  const py = size === "sm" ? 0.4 : 0.6;

  return (
    <Tooltip title={name} placement="top" arrow>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.6,
          px,
          py,
          borderRadius: "8px",
          border: `1px solid ${color}40`,
          background: `${color}12`,
          color,
          fontSize,
          fontWeight: 700,
          fontFamily: "'Syne', 'Inter', sans-serif",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
          cursor: "default",
          transition: "all 0.2s ease",
          "&:hover": {
            background: `${color}25`,
            borderColor: `${color}80`,
            boxShadow: `0 0 10px ${color}35`,
            transform: "translateY(-1px)",
          },
        }}
      >
        {IconComponent && (
          <IconComponent size={iconSize} style={{ flexShrink: 0 }} />
        )}
        {name}
      </Box>
    </Tooltip>
  );
}
