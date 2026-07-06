// Local development API server
// Mimics Vercel serverless functions on http://127.0.0.1:3001
// Usage: node dev-server.js  (or npm run dev:api)
require("dotenv").config();
const http = require("http");
const url  = require("url");

// ─── Minimal route matcher ────────────────────────────────────────────────────
// Returns { paramName: value, ... } when pattern matches, null otherwise
function matchRoute(pattern, pathname) {
  const pp = pattern.split("/").filter(Boolean);
  const rp = pathname.split("/").filter(Boolean);
  if (pp.length !== rp.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(":")) {
      params[pp[i].slice(1)] = decodeURIComponent(rp[i]);
    } else if (pp[i] !== rp[i]) {
      return null;
    }
  }
  return params;
}

// ─── Route table ─────────────────────────────────────────────────────────────
// Vercel uses [param] filenames; Express uses :param — we bridge them via req.query
const ROUTES = [
  { pattern: "/api/auth/login",      handler: require("./api/auth/login") },
  { pattern: "/api/auth/logout",     handler: require("./api/auth/logout") },
  { pattern: "/api/auth/me",         handler: require("./api/auth/me") },
  { pattern: "/api/auth/setup",      handler: require("./api/auth/setup") },
  { pattern: "/api/blogs",           handler: require("./api/blogs/index") },
  { pattern: "/api/blogs/:slug",     handler: require("./api/blogs/[slug]") },
  { pattern: "/api/admin/blogs",     handler: require("./api/admin/blogs") },
  { pattern: "/api/admin/blog/:id",  handler: require("./api/admin/blog/[id]") },
  { pattern: "/api/ai/chat",         handler: require("./api/ai/chat") },
  { pattern: "/api/github/analyze",  handler: require("./api/github/analyze") },
];

// ─── Parse JSON body for write methods ────────────────────────────────────────
function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body !== undefined) return resolve();
    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) { req.body = {}; return resolve(); }
    let raw = "";
    req.on("data", (c) => { raw += c; });
    req.on("end", () => {
      try { req.body = JSON.parse(raw); } catch { req.body = {}; }
      resolve();
    });
    req.on("error", () => { req.body = {}; resolve(); });
  });
}

// ─── Patch res with Express-compatible methods ───────────────────────────────
// Native http.ServerResponse only has writeHead/end/setHeader.
// Our Vercel handlers use res.status(), res.json(), res.send() — add them here.
function patchRes(res) {
  res.status = function (code) {
    this.statusCode = code;
    return this; // chainable: res.status(404).json(...)
  };

  res.json = function (data) {
    if (!this.headersSent) {
      this.setHeader("Content-Type", "application/json");
      this.end(JSON.stringify(data));
    }
    return this;
  };

  res.send = function (body) {
    if (!this.headersSent) {
      if (typeof body === "object" && body !== null) {
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(body));
      } else {
        this.setHeader("Content-Type", "text/plain");
        this.end(String(body));
      }
    }
    return this;
  };

  return res;
}

// ─── Server ───────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // Add Express-compatible methods to res
  patchRes(res);

  // Merge query string into req.query (Vercel behaviour)
  req.query = { ...parsed.query };

  // Pre-parse body for all non-GET requests
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    await parseBody(req);
  }

  for (const route of ROUTES) {
    const params = matchRoute(route.pattern, pathname);
    if (params !== null) {
      // Inject URL params into req.query (Vercel does this automatically)
      Object.assign(req.query, params);
      try {
        await route.handler(req, res);
      } catch (err) {
        console.error(`[${pathname}]`, err.message);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: err.message }));
        }
      }
      return;
    }
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: `No handler for ${pathname}` }));
});

const PORT = 3001;
server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  ⚡  API dev server  →  http://127.0.0.1:${PORT}\n`);
  console.log("  Routes:");
  ROUTES.forEach((r) => console.log(`    ${r.pattern}`));
  console.log();
});
