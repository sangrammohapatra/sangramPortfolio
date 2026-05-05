const connectDB = require("../../server/config/db");
const Admin     = require("../../server/models/Admin");
const setCors   = require("../../server/middleware/cors");
const parseBody = require("../../server/middleware/parseBody");

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });
  if (process.env.ADMIN_SETUP_ENABLED !== "true")
    return res.status(403).json({ error: "Setup disabled. Set ADMIN_SETUP_ENABLED=true in Vercel env vars." });
  // await parseBody(req);
  try {
    await connectDB();
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "username and password required" });
    const existing = await Admin.findOne({ username: username.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Admin already exists" });
    const admin = await Admin.create({ username, password });
    res.json({ success: true, username: admin.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
