const setCors = require("../../server/middleware/cors");
const auth    = require("../../server/middleware/auth");

// Lets the frontend recover the admin session from the httpOnly cookie on
// page load, since JS can no longer read the token out of localStorage.
module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const authError = auth(req, res);
  if (authError) return res.status(authError.status).json({ error: authError.error });

  res.json({ username: req.admin.username });
};
