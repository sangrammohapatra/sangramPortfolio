const setCors   = require("../../server/middleware/cors");
const rateLimit = require("../../server/middleware/rateLimit");
const { systemPrompt } = require("../../server/data/resumeContext.json");
// ─── Vercel Serverless Function — Gemini Flash Proxy ─────────────────────────
const GEMINI_MODEL = "gemini-2.5-flash";

// 20 requests per hour per IP — this proxies a paid Gemini call, so it needs a
// throttle to keep a scripted caller from running up the API bill.
const chatRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, prefix: "ai-chat" });

const MAX_MESSAGES     = 20;   // cap conversation length per request
const MAX_MESSAGE_CHARS = 2000; // cap per-message size

// Keep only well-formed { role, content } turns — anything else (extra
// fields, wrong types, oversized content) is dropped rather than forwarded.
function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return null;
  const trimmed = messages.slice(-MAX_MESSAGES);
  const clean = [];
  for (const m of trimmed) {
    if (!m || typeof m.content !== "string") return null;
    const content = m.content.trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) return null;
    clean.push({ role: m.role === "assistant" ? "assistant" : "user", content });
  }
  return clean.length ? clean : null;
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")   return res.status(405).send("Method not allowed");
  if (await chatRateLimit(req, res)) return;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).send("Missing GEMINI_API_KEY");

  // The system prompt is fixed server-side and never taken from the request —
  // otherwise any direct caller (bypassing the widget) could swap it out and
  // turn this into a free-form Gemini proxy billed to our API key.
  const messages = sanitizeMessages(req.body?.messages);
  if (!messages) {
    return res.status(400).send("Missing or invalid messages array");
  }

  const geminiPayload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

  try {
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return res.status(geminiRes.status).send(`Gemini error: ${err}`);
    }

    res.setHeader("Content-Type",      "text/event-stream");
    res.setHeader("Cache-Control",     "no-cache");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const reader  = geminiRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n").filter((l) => l.startsWith("data: "))) {
        const raw = line.replace("data: ", "").trim();
        if (!raw || raw === "[DONE]") continue;
        try {
          const text = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text) res.write(`data: ${JSON.stringify({ delta: { text } })}\n\n`);
        } catch (_) {}
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (err) {
    if (!res.headersSent) res.status(502).send(`Proxy error: ${err.message}`);
    else res.end();
  }
};
