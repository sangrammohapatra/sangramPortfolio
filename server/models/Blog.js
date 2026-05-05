const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, required: true, unique: true, lowercase: true },
  excerpt:   { type: String, required: true },
  content:   { type: String, required: true },
  tags:      [{ type: String }],
  coverColor:{ type: String, default: "#00ff87" },
  status:    { type: String, enum: ["draft", "published"], default: "draft" },
  views:     { type: Number, default: 0 },
  readTime:  { type: String, default: "5 min read" },
}, { timestamps: true });

// Auto-generate slug from title if not provided
BlogSchema.pre("validate", function() {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  // Auto estimate read time
  const words = this.content?.split(/\s+/).length || 0;
  this.readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
});

module.exports = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
