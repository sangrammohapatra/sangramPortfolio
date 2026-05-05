const connectDB   = require("../../server/config/db");
const Admin       = require("../../server/models/Admin");
const setCors     = require("../../server/middleware/cors");
const parseBody   = require("../../server/middleware/parseBody");
const jwt         = require("jsonwebtoken");

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });
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
    res.json({ token, username: admin.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
