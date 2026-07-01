const mongoose = require("mongoose");

const RepoAnalysisSchema = new mongoose.Schema(
  {
    github_url: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    repo_full_name: String,
    github_data: {
      stars: Number,
      forks: Number,
      language: String,
      languages: { type: mongoose.Schema.Types.Mixed, default: {} },
      description: String,
      topics: [String],
      updated_at: String,
      default_branch: String,
    },
    analysis: {
      tech_stack: {
        frontend: [String],
        backend: [String],
        database: [String],
        devops: [String],
      },
      ai_tools: [String],
      skills_demonstrated: [String],
      summary: String,
    },
    analyzed_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.RepoAnalysis ||
  mongoose.model("RepoAnalysis", RepoAnalysisSchema);
