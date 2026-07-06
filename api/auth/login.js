const connectDB   = require("../../server/config/db");
const Admin       = require("../../server/models/Admin");
const setCors     = require("../../server/middleware/cors");
const parseBody   = require("../../server/middleware/parseBody");
const rateLimit   = require("../../server/middleware/rateLimit");
const jwt         = require("jsonwebtoken");
const { serializeCookie } = require("../../server/utils/cookies");

const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days, in seconds

// 5 attempts per 15 minutes per IP — login is the only endpoint that checks a
// password, so it's the one that needs to block brute-forcing directly.
const loginRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, prefix: "login" });

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });
  if (await loginRateLimit(req, res)) return;
  await parseBody(req);
  try {
    await connectDB();
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await admin.comparePassword(password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Token lives only in an httpOnly cookie — never in the JSON body — so
    // it can't be read or exfiltrated by injected/XSS'd JS on the page.
    res.setHeader("Set-Cookie", serializeCookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: TOKEN_MAX_AGE,
    }));
    res.json({ username: admin.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
