// ─── Vercel Serverless Function — Anthropic Proxy ─────────────────────────────
// Route: POST /api/chat
//
// Why this exists:
//   The Anthropic API key must NEVER be exposed in frontend code.
//   This function runs on Vercel's servers, adds the secret key server-side,
//   and streams the response back to the browser.
//
// Setup:
//   1. Deploy to Vercel (see HOW_TO_APPLY.md)
//   2. Add ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables
//   That's it. The frontend calls /api/chat — Vercel handles the rest.

export const config = {
  runtime: "edge", // Edge runtime = lowest latency, streaming support
};

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL         = "claude-sonnet-4-20250514";
const MAX_TOKENS    = 400;

export default async function handler(req) {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // CORS headers — allow your deployed domain + localhost dev
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    // Add your production domain here, e.g.:
    // "https://sangrammohapatra.vercel.app",
    // "https://yourdomain.com",
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const corsHeaders = {
    "Access-Control-Allow-Origin":  corsOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400, headers: corsHeaders });
  }

  const { messages, system } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response("Missing messages array", { status: 400, headers: corsHeaders });
  }

  // Get API key from environment (set in Vercel dashboard — never hardcode)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("Server misconfigured: missing API key", { status: 500, headers: corsHeaders });
  }

  // Forward request to Anthropic with streaming
  try {
    const anthropicRes = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "Content-Type":         "application/json",
        "x-api-key":            apiKey,           // ← Secret key added server-side
        "anthropic-version":    "2023-06-01",
        "anthropic-beta":       "messages-2023-12-15",
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system:     system || "",
        messages,
        stream:     true,
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return new Response(`Anthropic error: ${err}`, {
        status: anthropicRes.status,
        headers: corsHeaders,
      });
    }

    // Stream Anthropic's SSE response straight back to the browser
    return new Response(anthropicRes.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type":      "text/event-stream",
        "Cache-Control":     "no-cache",
        "X-Accel-Buffering": "no",
      },
    });

  } catch (err) {
    return new Response(`Proxy error: ${err.message}`, {
      status: 502,
      headers: corsHeaders,
    });
  }
}
