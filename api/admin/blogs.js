const connectDB = require("../../server/config/db");
const Blog      = require("../../server/models/Blog");
const setCors   = require("../../server/middleware/cors");
const parseBody = require("../../server/middleware/parseBody");
const auth      = require("../../server/middleware/auth");

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  await new Promise((resolve) => auth(req, res, resolve));
  if (res.writableEnded) return;
  try {
    await connectDB();
    if (req.method === "GET") {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return res.json(blogs);
    }
    if (req.method === "POST") {
      await parseBody(req);
      const { title, excerpt, content, tags, coverColor, status } = req.body || {};
      if (!title || !content) return res.status(400).json({ error: "title and content required" });
      let slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      const existing = await Blog.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now()}`;
      const words = content.split(/\s+/).length;
      const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
      const blog = await Blog.create({ title, slug, excerpt, content, tags, coverColor, status, readTime });
      return res.status(201).json(blog);
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
