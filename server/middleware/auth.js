const jwt = require("jsonwebtoken");
const { parseCookies } = require("../utils/cookies");

module.exports = function authMiddleware(req, res) {
  let token = null;

  const cookies = parseCookies(req);
  if (cookies.admin_token) token = cookies.admin_token;

  const header = req.headers.authorization;
  if (!token && header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) return { error: "No token provided", status: 401 };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // attach to request
    return null; // ✅ success
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
};
