// ─── Vercel Edge Function — Gemini Flash Proxy ────────────────────────────────
// Route: POST /api/chat
//
// FREE tier: Gemini 1.5 Flash — 1,500 requests/day, no credit card needed.
// Get your key: https://aistudio.google.com → "Get API key" → free.
//
// Setup:
//   1. Get free key from aistudio.google.com
//   2. Add GEMINI_API_KEY in Vercel dashboard → Settings → Environment Variables
//   3. Deploy — done.

export const config = { runtime: "edge" };

const GEMINI_MODEL = "gemini-1.5-flash-latest";

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("Server misconfigured: missing GEMINI_API_KEY", {
      status: 500, headers: corsHeaders(req),
    });
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response("Invalid JSON", { status: 400, headers: corsHeaders(req) }); }

  const { messages, system } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response("Missing messages array", { status: 400, headers: corsHeaders(req) });
  }

  // ── Convert to Gemini format ─────────────────────────────────────────────
  // Gemini uses { role: "user"|"model", parts: [{ text }] }
  // "assistant" → "model" in Gemini's API
  const geminiContents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const geminiPayload = {
    system_instruction: system ? { parts: [{ text: system }] } : undefined,
    contents: geminiContents,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.7,
    },
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
      return new Response(`Gemini error: ${err}`, {
        status: geminiRes.status, headers: corsHeaders(req),
      });
    }

    // ── Transform Gemini SSE → Anthropic-compatible SSE ───────────────────
    // The widget already parses Anthropic's { delta: { text } } format,
    // so we translate Gemini's chunks on the fly using a TransformStream.
    const { readable, writable } = new TransformStream();
    const writer  = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Stream transform runs in background
    (async () => {
      const reader = geminiRes.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const raw = line.replace("data: ", "").trim();
            if (!raw || raw === "[DONE]") continue;
            try {
              const parsed = JSON.parse(raw);
              // Gemini path: candidates[0].content.parts[0].text
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (!text) continue;
              // Re-emit in Anthropic delta format so the widget needs no changes
              const out = JSON.stringify({ delta: { text } });
              await writer.write(encoder.encode(`data: ${out}\n\n`));
            } catch (_) {}
          }
        }
      } finally {
        await writer.write(encoder.encode("data: [DONE]\n\n"));
        await writer.close();
      }
    })();

    return new Response(readable, {
      status: 200,
      headers: {
        ...corsHeaders(req),
        "Content-Type":      "text/event-stream",
        "Cache-Control":     "no-cache",
        "X-Accel-Buffering": "no",
      },
    });

  } catch (err) {
    return new Response(`Proxy error: ${err.message}`, {
      status: 502, headers: corsHeaders(req),
    });
  }
}

// ── CORS ─────────────────────────────────────────────────────────────────────
function corsHeaders(req) {
  const origin  = req?.headers?.get?.("origin") || "";
  const allowed = [
    "http://localhost:3000",
    "http://localhost:5173",
    // Add your production domain:
    // "https://sangrammohapatra.vercel.app",
  ];
  return {
    "Access-Control-Allow-Origin":  allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
