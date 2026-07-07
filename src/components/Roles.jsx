import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import SectionWrapper from "./SectionWrapper";
import { roles } from "../data/roles";
import { fadeUp } from "../utils/motionVariants";

function ConnectorIcon({ role, theme }) {
  return (
    <Box sx={{ position: "relative", width: 40, height: 68 }}>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 2,
          background: role.color,
          opacity: 0.6,
          transform: "translateX(-50%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: theme.palette.background.default,
          border: `2px solid ${role.color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
        }}
      >
        {role.icon}
      </Box>
    </Box>
  );
}

function Badge({ role, number, theme }) {
  return (
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: `3px solid ${role.color}`,
        background: `${role.color}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "1rem",
        color: role.color,
        fontFamily: "'Syne', sans-serif",
        flexShrink: 0,
      }}
    >
      {String(number).padStart(2, "0")}
    </Box>
  );
}

function TextBlock({ role, theme }) {
  return (
    <Box sx={{ width: 190, textAlign: "center" }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.88rem",
          color: theme.palette.text.primary,
        }}
      >
        {role.title}
      </Typography>
      <Typography
        sx={{
          color: role.color,
          fontWeight: 600,
          fontSize: "0.76rem",
          mb: 0.3,
        }}
      >
        {role.organization}
      </Typography>
      <Typography
        sx={{ color: theme.palette.text.muted, fontSize: "0.7rem", mb: 0.6 }}
      >
        {role.duration}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.76rem",
          color: theme.palette.text.secondary,
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {role.description}
      </Typography>
    </Box>
  );
}

const SPINE_HEIGHT = 30;
const DOT_SIZE = 22;

function WaveTimeline({ isInView }) {
  const theme = useTheme();
  const n = roles.length;

  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        position: "relative",
        height: 420,
        mt: 6,
        mb: 2,
        px: 4,
      }}
    >
      {/* spine */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: SPINE_HEIGHT,
          transform: "translateY(-50%)",
          background: theme.palette.divider,
          borderRadius: SPINE_HEIGHT / 2,
        }}
      />

      {roles.map((role, i) => {
        const isUp = i % 2 === 0;
        const leftPct = `${((i + 0.5) / n) * 100}%`;
        return (
          <Box
            key={role.id}
            component={motion.div}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={i}
            sx={{
              position: "absolute",
              left: leftPct,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              ...(isUp ? { bottom: "50%" } : { top: "50%" }),
            }}
          >
            {isUp ? (
              <>
                <TextBlock role={role} theme={theme} />
                <Badge role={role} number={i + 1} theme={theme} />
                <ConnectorIcon role={role} theme={theme} />
              </>
            ) : (
              <>
                <ConnectorIcon role={role} theme={theme} />
                <Badge role={role} number={i + 1} theme={theme} />
                <TextBlock role={role} theme={theme} />
              </>
            )}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: "50%",
                background: role.color,
                boxShadow: `0 0 0 4px ${theme.palette.background.default}, 0 0 10px ${role.color}80`,
                ...(isUp ? { bottom: -DOT_SIZE / 2 } : { top: -DOT_SIZE / 2 }),
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

const ROW_H = 210;
const TRACK_W = 56;
const NODE_SIZE = 30;

function VerticalTimeline({ isInView }) {
  const theme = useTheme();
  const n = roles.length;

  const nodeX = (i) => (i % 2 === 0 ? TRACK_W * 0.32 : TRACK_W * 0.68);
  const nodeY = (i) => i * ROW_H + ROW_H / 2;

  const segments = [];
  for (let i = 0; i < n - 1; i++) {
    const x1 = nodeX(i);
    const y1 = nodeY(i);
    const x2 = nodeX(i + 1);
    const y2 = nodeY(i + 1);
    segments.push({
      d: `M ${x1} ${y1} C ${x1} ${y1 + ROW_H / 2}, ${x2} ${y2 - ROW_H / 2}, ${x2} ${y2}`,
      color: roles[i + 1].color,
    });
  }

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `1fr ${TRACK_W}px 1fr`,
          gridTemplateRows: `repeat(${n}, ${ROW_H}px)`,
        }}
      >
        <Box
          sx={{
            gridColumn: 2,
            gridRow: `1 / span ${n}`,
            position: "relative",
            height: n * ROW_H,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${TRACK_W} ${n * ROW_H}`}
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "visible",
            }}
          >
            {segments.map((s, i) => (
              <path
                key={i}
                d={s.d}
                fill="none"
                stroke={s.color}
                strokeWidth={9}
                strokeLinecap="round"
                opacity={0.85}
              />
            ))}
          </svg>
          {roles.map((role, i) => (
            <Box
              key={role.id}
              sx={{
                position: "absolute",
                left: nodeX(i),
                top: nodeY(i),
                transform: "translate(-50%, -50%)",
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: "50%",
                background: theme.palette.background.default,
                border: `3px solid ${role.color}`,
                boxShadow: `0 0 0 4px ${theme.palette.background.default}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
              }}
            >
              {role.icon}
            </Box>
          ))}
        </Box>

        {roles.map((role, i) => {
          const isLeft = i % 2 === 0;
          const yearMatch = role.duration.match(/\d{4}/);
          const year = yearMatch ? yearMatch[0] : role.duration;
          return (
            <Box
              key={role.id}
              component={motion.div}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i}
              sx={{
                gridColumn: isLeft ? 1 : 3,
                gridRow: i + 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: isLeft ? "flex-end" : "flex-start",
                textAlign: isLeft ? "right" : "left",
                px: 2,
                height: ROW_H,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: role.color,
                  lineHeight: 1,
                }}
              >
                {year}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  color: theme.palette.text.muted,
                  mb: 0.6,
                }}
              >
                {role.duration}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: theme.palette.text.primary,
                }}
              >
                {role.icon} {role.title}
              </Typography>
              <Typography
                sx={{
                  color: role.color,
                  fontWeight: 600,
                  fontSize: "0.76rem",
                  mb: 0.5,
                }}
              >
                {role.organization}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {role.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default function Roles() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <SectionWrapper
      id="roles"
      title="Roles & Positions"
      subtitle="LEADERSHIP & INVOLVEMENT"
    >
      <Box ref={ref} sx={{ marginTop: 15 }}>
        <WaveTimeline isInView={isInView} />
        <VerticalTimeline isInView={isInView} />
      </Box>
    </SectionWrapper>
  );
}
