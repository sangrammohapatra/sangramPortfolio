import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box, Typography, IconButton, Paper, TextField, Chip,
  Avatar, CircularProgress, Tooltip, Fade, useTheme, useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { RESUME_CONTEXT, SUGGESTED_QUESTIONS } from "../data/resumeContext";

// ─── Config ──────────────────────────────────────────────────────────────────
// In dev  → calls Vite proxy → localhost:3000/api/chat → Vercel function
// In prod → calls /api/chat directly on your Vercel deployment
// No API key ever touches the browser.
const PROXY_URL = "/api/chat";

// ─── Sub-components ──────────────────────────────────────────────────────────
function TypingDots({ theme }) {
  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", py: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: theme.palette.primary.main,
          }}
        />
      ))}
    </Box>
  );
}

function CopyButton({ text, theme }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
      <IconButton size="small" onClick={copy} sx={{
        color: theme.palette.text.muted, p: 0.3,
        opacity: 0, ".msg-bubble:hover &": { opacity: 1 },
        transition: "opacity 0.2s",
        "&:hover": { color: theme.palette.primary.main },
      }}>
        {copied
          ? <CheckIcon sx={{ fontSize: 12 }} />
          : <ContentCopyIcon sx={{ fontSize: 12 }} />}
      </IconButton>
    </Tooltip>
  );
}

function MessageBubble({ msg, theme }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Box sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 1, mb: 2,
      }}>
        {!isUser && (
          <Avatar sx={{
            width: 28, height: 28, flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            fontSize: "0.75rem", fontWeight: 800,
          }}>S</Avatar>
        )}
        <Box className="msg-bubble" sx={{ position: "relative", maxWidth: "80%" }}>
          <Box sx={{
            px: 2, py: 1.5,
            background: isUser
              ? `linear-gradient(135deg, ${theme.palette.primary.main}22, ${theme.palette.primary.main}12)`
              : theme.palette.background.elevated,
            border: `1px solid ${isUser ? theme.palette.primary.main + "40" : theme.palette.divider}`,
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          }}>
            <Typography sx={{
              fontSize: "0.85rem", color: theme.palette.text.primary,
              lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>
              {msg.content}
            </Typography>
          </Box>
          {!isUser && (
            <Box sx={{ position: "absolute", top: 4, right: -24 }}>
              <CopyButton text={msg.content} theme={theme} />
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────
export default function AIChatWidget() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen]               = useState(false);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [streamText, setStreamText]   = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [error, setError]             = useState(null);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Keyboard shortcut: Cmd/Ctrl + .
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ".") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const userMsg = text.trim();
    if (!userMsg || loading) return;

    setInput("");
    setError(null);
    setShowSuggestions(false);

    const nextMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(nextMessages);
    setLoading(true);
    setStreamText("");

    try {
      // Call our Vercel proxy — never exposes the API key to the browser
      const res = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: RESUME_CONTEXT,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}: ${await res.text()}`);
      }

      // Read SSE stream
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const raw = line.replace("data: ", "").trim();
          if (raw === "[DONE]") continue;
          try {
            const parsed = JSON.parse(raw);
            const delta  = parsed?.delta?.text || "";
            fullText    += delta;
            setStreamText(fullText);
          } catch (_) {}
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
      setStreamText("");

    } catch (err) {
      setError("Connection failed. Email Sangram directly: sangrammohapatra0203@gmail.com");
      setStreamText("");
    }

    setLoading(false);
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStreamText("");
    setError(null);
    setShowSuggestions(true);
  };

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: "fixed",
              bottom: isMobile ? 80 : 88,
              right: 24,
              zIndex: 1000,
            }}
          >
            <Tooltip title="Ask about Sangram (⌘.)" placement="left">
              <Box
                onClick={() => setOpen(true)}
                sx={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: `0 0 24px ${theme.palette.primary.main}50, 0 4px 20px rgba(0,0,0,0.3)`,
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: `0 0 36px ${theme.palette.primary.main}70, 0 6px 28px rgba(0,0,0,0.4)`,
                  },
                }}
              >
                <AutoAwesomeIcon sx={{ color: "#000", fontSize: 24 }} />
              </Box>
            </Tooltip>
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: `2px solid ${theme.palette.primary.main}`,
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              bottom: isMobile ? 0 : 88,
              right:  isMobile ? 0 : 24,
              left:   isMobile ? 0 : "auto",
              zIndex: 1000,
              width:  isMobile ? "100%" : 380,
            }}
          >
            <Paper sx={{
              display: "flex", flexDirection: "column",
              height: isMobile ? "85vh" : 520,
              borderRadius: isMobile ? "20px 20px 0 0" : 3,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.primary.main}30`,
              boxShadow: `0 0 40px ${theme.palette.primary.main}15, 0 24px 80px rgba(0,0,0,0.5)`,
              overflow: "hidden",
            }}>

              {/* Header */}
              <Box sx={{
                px: 2.5, py: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}08)`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: "flex", alignItems: "center", gap: 1.5,
              }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <AutoAwesomeIcon sx={{ color: "#000", fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: theme.palette.text.primary, lineHeight: 1.2 }}>
                    Ask about Sangram
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.2 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: theme.palette.primary.main }} />
                    <Typography sx={{ fontSize: "0.7rem", color: theme.palette.text.secondary }}>
                      AI-powered · Claude
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {messages.length > 0 && (
                    <Tooltip title="Clear chat">
                      <IconButton size="small" onClick={clearChat}
                        sx={{ color: theme.palette.text.muted, "&:hover": { color: theme.palette.primary.main } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton size="small" onClick={() => setOpen(false)}
                    sx={{ color: theme.palette.text.muted, "&:hover": { color: theme.palette.text.primary } }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{
                flex: 1, overflowY: "auto", px: 2, py: 2,
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": { background: theme.palette.divider, borderRadius: 2 },
              }}>
                {/* Welcome */}
                {messages.length === 0 && !loading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Box sx={{ textAlign: "center", py: 2, mb: 2 }}>
                      <Box sx={{
                        width: 52, height: 52, borderRadius: "50%", mx: "auto", mb: 1.5,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}25, ${theme.palette.secondary.main}15)`,
                        border: `1px solid ${theme.palette.primary.main}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <AutoAwesomeIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                      </Box>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                        Hi! I'm Sangram's AI assistant
                      </Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                        Ask me anything about his experience, skills, or availability. I'll answer from his resume.
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                {/* Suggested questions */}
                {showSuggestions && messages.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Typography sx={{ fontSize: "0.68rem", color: theme.palette.text.muted, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, fontWeight: 700 }}>
                      Try asking
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 2 }}>
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <Box key={q} onClick={() => sendMessage(q)} sx={{
                          px: 2, py: 1.2,
                          background: theme.palette.background.card,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2, cursor: "pointer",
                          fontSize: "0.8rem", color: theme.palette.text.secondary,
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            background: `${theme.palette.primary.main}08`,
                            transform: "translateX(3px)",
                          },
                        }}>
                          {q}
                        </Box>
                      ))}
                    </Box>
                  </motion.div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} theme={theme} />
                ))}

                {/* Streaming */}
                {streamText && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 2 }}>
                      <Avatar sx={{
                        width: 28, height: 28, flexShrink: 0,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        fontSize: "0.75rem", fontWeight: 800,
                      }}>S</Avatar>
                      <Box sx={{
                        px: 2, py: 1.5, maxWidth: "80%",
                        background: theme.palette.background.elevated,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "16px 16px 16px 4px",
                      }}>
                        <Typography sx={{ fontSize: "0.85rem", color: theme.palette.text.primary, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                          {streamText}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            style={{
                              display: "inline-block", width: 2, height: 14,
                              background: theme.palette.primary.main,
                              marginLeft: 2, verticalAlign: "middle", borderRadius: 1,
                            }}
                          />
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                )}

                {/* Loading dots */}
                {loading && !streamText && (
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 2 }}>
                    <Avatar sx={{
                      width: 28, height: 28, flexShrink: 0,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontSize: "0.75rem", fontWeight: 800,
                    }}>S</Avatar>
                    <Box sx={{
                      px: 2, py: 1.5,
                      background: theme.palette.background.elevated,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "16px 16px 16px 4px",
                    }}>
                      <TypingDots theme={theme} />
                    </Box>
                  </Box>
                )}

                {/* Error */}
                {error && (
                  <Box sx={{
                    mx: 1, px: 2, py: 1.5, mb: 2,
                    background: "rgba(255,77,109,0.08)",
                    border: "1px solid rgba(255,77,109,0.25)",
                    borderRadius: 2,
                  }}>
                    <Typography sx={{ fontSize: "0.8rem", color: "#ff4d6d" }}>{error}</Typography>
                  </Box>
                )}

                <div ref={bottomRef} />
              </Box>

              {/* Input */}
              <Box sx={{
                px: 2, py: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <TextField
                    inputRef={inputRef}
                    fullWidth multiline maxRows={4}
                    placeholder="Ask me anything about Sangram…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        background: theme.palette.background.elevated,
                        borderRadius: 2.5, fontSize: "0.85rem",
                        "& fieldset": { borderColor: theme.palette.divider },
                        "&:hover fieldset": { borderColor: theme.palette.primary.main },
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                      },
                    }}
                  />
                  <IconButton
                    type="submit"
                    disabled={!input.trim() || loading}
                    sx={{
                      width: 40, height: 40, flexShrink: 0,
                      background: input.trim() && !loading
                        ? theme.palette.primary.main
                        : theme.palette.background.elevated,
                      color: input.trim() && !loading ? "#000" : theme.palette.text.muted,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2, transition: "all 0.2s",
                      "&:hover": {
                        background: theme.palette.primary.main,
                        color: "#000",
                        boxShadow: `0 0 16px ${theme.palette.primary.main}50`,
                      },
                      "&.Mui-disabled": {
                        background: theme.palette.background.elevated,
                        color: theme.palette.text.muted,
                      },
                    }}
                  >
                    {loading
                      ? <CircularProgress size={16} sx={{ color: theme.palette.text.muted }} />
                      : <SendIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </Box>
                <Typography sx={{ fontSize: "0.62rem", color: theme.palette.text.muted, mt: 0.8, textAlign: "center" }}>
                  Powered by Claude · ⌘. to toggle · Enter to send
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
