// ─── Vercel Edge Function — Gemini Flash Proxy ────────────────────────────────
// Route: POST /api/chat
// FREE: Gemini 1.5 Flash — 1,500 req/day, no credit card.
// Key:  https://aistudio.google.com → "Get API key"

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
    return new Response("Missing GEMINI_API_KEY", {
      status: 500, headers: corsHeaders(req),
    });
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response("Invalid JSON", { status: 400, headers: corsHeaders(req) }); }

  const { messages, system } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response("Missing messages", { status: 400, headers: corsHeaders(req) });
  }

  // Convert to Gemini format
  const geminiContents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const geminiPayload = {
    ...(system && { system_instruction: { parts: [{ text: system }] } }),
    contents: geminiContents,
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
      return new Response(`Gemini error: ${err}`, {
        status: geminiRes.status, headers: corsHeaders(req),
      });
    }

    // Translate Gemini SSE → Anthropic delta format on the fly
    const { readable, writable } = new TransformStream();
    const writer  = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    (async () => {
      const reader = geminiRes.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n").filter((l) => l.startsWith("data: "))) {
            const raw = line.replace("data: ", "").trim();
            if (!raw || raw === "[DONE]") continue;
            try {
              const text = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) await writer.write(encoder.encode(`data: ${JSON.stringify({ delta: { text } })}\n\n`));
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

function corsHeaders(req) {
  const origin  = req?.headers?.get?.("origin") || "";
  const allowed = [
    "http://localhost:3000",
    "http://localhost:5173",
    // Add your Vercel URL after first deploy, e.g.:
    // "https://sangrammohapatra.vercel.app",
  ];
  return {
    "Access-Control-Allow-Origin":  allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
