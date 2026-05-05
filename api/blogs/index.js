// GET /api/blogs  — public, returns published posts only
const connectDB = require("../../server/config/db");
const Blog      = require("../../server/models/Blog");
const setCors   = require("../../server/middleware/cors");

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET")    return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();
    const blogs = await Blog.find({ status: "published" })
      .select("-content")       // omit full content in list view
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
