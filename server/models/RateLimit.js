const mongoose = require("mongoose");

const RateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

// TTL index — Mongo automatically drops expired windows, no cleanup job needed
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
