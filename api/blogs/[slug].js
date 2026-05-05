// GET /api/blogs/:slug  — public, single post + increment views
const connectDB = require("../../server/config/db");
const Blog      = require("../../server/models/Blog");
const setCors   = require("../../server/middleware/cors");

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET")    return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();
    const { slug } = req.query;
    const blog = await Blog.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Post not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
