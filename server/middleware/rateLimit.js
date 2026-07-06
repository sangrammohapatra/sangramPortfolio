const connectDB   = require("../config/db");
const RateLimit   = require("../models/RateLimit");

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

// Fixed-window counter backed by Mongo — an in-memory counter would reset on
// every cold start / instance on Vercel, so it can't actually bound abuse.
// Returns true (and writes a 429) when the caller should be blocked.
function rateLimit({ windowMs, max, prefix }) {
  return async function checkRateLimit(req, res) {
    const ip = getClientIp(req);
    const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
    const key = `${prefix}:${ip}:${windowStart}`;

    await connectDB();

    let doc;
    try {
      doc = await RateLimit.findOneAndUpdate(
        { key },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowStart + windowMs) } },
        { upsert: true, new: true }
      );
    } catch (err) {
      // Concurrent upserts on a brand-new key can race into a duplicate-key
      // error; the doc now exists, so a plain update succeeds on retry.
      if (err.code === 11000) {
        doc = await RateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { new: true });
      } else {
        throw err;
      }
    }

    if (doc.count > max) {
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return true;
    }
    return false;
  };
}

module.exports = rateLimit;
