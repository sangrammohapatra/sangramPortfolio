// ─── Vercel Serverless Function — Gemini Flash Proxy ─────────────────────────
const GEMINI_MODEL = "gemini-1.5-flash-latest";

module.exports = async function handler(req, res) {
  // ── CORS ───────────────────────────────────────────────────────────────────
  const allowed = [
    "http://localhost:3000",
    "http://localhost:5173",
    // Add your Vercel URL after first deploy:
   "https://sangram-portfolio-three.vercel.app/"
  ];
  const origin = req.headers.origin || "";
  res.setHeader("Access-Control-Allow-Origin", allowed.includes(origin) ? origin : allowed[0]);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")   return res.status(405).send("Method not allowed");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).send("Missing GEMINI_API_KEY");

  const { messages, system } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).send("Missing messages array");
  }

  const geminiPayload = {
    ...(system && { system_instruction: { parts: [{ text: system }] } }),
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
