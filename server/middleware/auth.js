const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return { error: "No token provided", status: 401 };
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // attach to request
    return null; // ✅ success
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
};
