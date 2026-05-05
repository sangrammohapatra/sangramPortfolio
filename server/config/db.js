const mongoose = require("mongoose");

let cached = null;

async function connectDB() {
  if (cached) return cached;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI env var not set");
  cached = await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  return cached;
}

module.exports = connectDB;
