const connectDB = require("../../../server/config/db");
const Blog      = require("../../../server/models/Blog");
const setCors   = require("../../../server/middleware/cors");
const parseBody = require("../../../server/middleware/parseBody");
const auth      = require("../../../server/middleware/auth");

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  await new Promise((resolve) => auth(req, res, resolve));
  if (res.writableEnded) return;
  try {
    await connectDB();
    const { id } = req.query;
    if (req.method === "GET") {
      const blog = await Blog.findById(id);
      if (!blog) return res.status(404).json({ error: "Not found" });
      return res.json(blog);
    }
    if (req.method === "PUT") {
      await parseBody(req);
      const updates = req.body || {};
      if (updates.content) {
        const words = updates.content.split(/\s+/).length;
        updates.readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
      }
      const blog = await Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!blog) return res.status(404).json({ error: "Not found" });
      return res.json(blog);
    }
    if (req.method === "DELETE") {
      await Blog.findByIdAndDelete(id);
      return res.json({ success: true });
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
