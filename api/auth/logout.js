const setCors = require("../../server/middleware/cors");
const { serializeCookie } = require("../../server/utils/cookies");

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  res.setHeader("Set-Cookie", serializeCookie("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 0,
  }));
  res.json({ success: true });
};
