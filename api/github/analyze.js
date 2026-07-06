// POST /api/github/analyze
// Fetches GitHub repo data, runs AI analysis via Gemini, caches in MongoDB
const setCors = require("../../server/middleware/cors");
const connectDB = require("../../server/config/db");
const RepoAnalysis = require("../../server/models/RepoAnalysis");
const rateLimit = require("../../server/middleware/rateLimit");

const GEMINI_MODEL = "gemini-2.5-flash";
const CACHE_TTL_DAYS = 7;

// 15 requests per hour per IP — only gates fresh analyses (cache hits are
// served above this check), since those are the ones that hit paid GitHub/Gemini APIs.
const analyzeRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 15, prefix: "gh-analyze" });

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/\s]+)\/([^/\s?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

function buildGitHubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-repo-analyzer/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchRepoMeta(owner, repo) {
  const headers = buildGitHubHeaders();
  const [repoRes, langsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
  ]);

  if (repoRes.status === 404) throw new Error("Repository not found or is private.");
  if (repoRes.status === 403) throw new Error("GitHub API rate limit reached. Try again later.");
  if (!repoRes.ok) throw new Error(`GitHub API error: ${repoRes.status}`);

  const repoData = await repoRes.json();
  const languages = langsRes.ok ? await langsRes.json() : {};

  return {
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    language: repoData.language,
    languages,
    description: repoData.description || "",
    topics: repoData.topics || [],
    updated_at: repoData.updated_at,
    default_branch: repoData.default_branch || "main",
  };
}

async function fetchFileContent(owner, repo, path, branch) {
  const headers = buildGitHubHeaders();
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.content || data.encoding !== "base64") return null;
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

async function gatherPackageFiles(owner, repo, branch) {
  const paths = [
    "package.json",
    "client/package.json",
    "server/package.json",
    "frontend/package.json",
    "backend/package.json",
    "app/package.json",
    "web/package.json",
  ];
  const results = await Promise.all(
    paths.map(async (p) => {
      const content = await fetchFileContent(owner, repo, p, branch);
      if (!content) return null;
      try {
        // Send only dep names — much more token-efficient than full JSON
        const parsed = JSON.parse(content);
        const allDeps = [
          ...Object.keys(parsed.dependencies || {}),
          ...Object.keys(parsed.devDependencies || {}),
        ];
        const scriptKeys = Object.keys(parsed.scripts || {}).join(", ");
        return {
          path: p,
          content: `name: ${parsed.name || "unknown"}\ndeps: ${allDeps.join(", ")}\nscripts: ${scriptKeys}`,
        };
      } catch {
        return { path: p, content: content.substring(0, 800) };
      }
    })
  );
  return results.filter(Boolean);
}

async function analyzeWithGemini(githubData, packageFiles, readme) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const langList = Object.keys(githubData.languages).join(", ") || githubData.language || "Unknown";
  const pkgSection = packageFiles.length
    ? packageFiles.map((f) => `=== ${f.path} ===\n${f.content.substring(0, 1500)}`).join("\n\n")
    : "No package.json files found.";
  const readmeSection = readme
    ? `README (first 1500 chars):\n${readme.substring(0, 1500)}`
    : "No README available.";

  const prompt = `Analyze this GitHub repository. Return ONLY valid JSON — no markdown, no code fences, no explanations.

Repository metadata:
- Primary language: ${githubData.language || "Unknown"}
- All languages: ${langList}
- Topics/tags: ${githubData.topics.join(", ") || "none"}
- Description: ${githubData.description || "none"}

${pkgSection}

${readmeSection}

Return exactly this JSON structure:
{
  "tech_stack": {
    "frontend": [],
    "backend": [],
    "database": [],
    "devops": []
  },
  "ai_tools": [],
  "skills_demonstrated": [],
  "summary": ""
}

Strict rules:
- tech_stack arrays: only include items you have clear evidence for from the data above
- Use canonical casing: "React" not "react", "Node.js" not "nodejs", "Next.js" not "nextjs"
- ai_tools: ONLY actual AI/ML libraries or APIs (OpenAI, LangChain, HuggingFace, Gemini, Anthropic, TensorFlow, PyTorch, etc.) — use [] if none
- skills_demonstrated: high-level engineering concepts, NOT technology names
  Good examples: "State Management", "JWT Authentication", "REST API Design", "Real-time Communication", "Role-Based Access Control", "Drag and Drop", "CI/CD Pipeline", "Containerization", "Prompt Engineering", "RAG Architecture", "Database Schema Design", "Responsive UI", "Server-Side Rendering"
- summary: 1-2 sentences describing what the project does and its key technical achievement
- If uncertain, omit from the array rather than guessing
- devops: include deployment platforms (Vercel, AWS, Railway, Render, etc.) if mentioned
- Limit each array to at most 8 items — pick the most significant ones`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.2,
        // Disable thinking mode — thinking tokens eat into the budget and the
        // structured-JSON task doesn't benefit from extended reasoning
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status} ${await res.text()}`);

  const data = await res.json();

  // gemini-2.5-flash may return multiple parts (thinking + response).
  // Collect all non-thought parts and join them to get the actual output.
  const parts = data.candidates?.[0]?.content?.parts || [];
  const text = parts
    .filter((p) => !p.thought)
    .map((p) => p.text || "")
    .join("")
    .trim();

  if (!text) {
    const raw = JSON.stringify(data).slice(0, 400);
    throw new Error(`Gemini returned empty response. Raw: ${raw}`);
  }

  // Extract the JSON object — handles responses wrapped in markdown fences
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini returned no JSON. Got: ${text.slice(0, 300)}`);

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Failed to parse Gemini JSON: ${e.message}. Got: ${jsonMatch[0].slice(0, 200)}`);
  }
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { github_url } = req.body || {};
  if (!github_url || typeof github_url !== "string") {
    return res.status(400).json({ error: "github_url is required" });
  }

  const parsed = parseGitHubUrl(github_url.trim());
  if (!parsed) {
    return res.status(400).json({ error: "Invalid GitHub URL. Expected format: https://github.com/username/repo" });
  }

  const normalizedUrl = `https://github.com/${parsed.owner}/${parsed.repo}`.toLowerCase();

  try {
    await connectDB();

    // Cache hit — serve if fresh
    const cached = await RepoAnalysis.findOne({ github_url: normalizedUrl });
    if (cached) {
      const ageDays = (Date.now() - new Date(cached.analyzed_at).getTime()) / 86_400_000;
      if (ageDays < CACHE_TTL_DAYS) {
        return res.json({ ...cached.toObject(), cached: true });
      }
    }

    // Only fresh analyses (past this point) call the paid GitHub/Gemini APIs
    if (await analyzeRateLimit(req, res)) return;

    // Fetch GitHub metadata
    const githubData = await fetchRepoMeta(parsed.owner, parsed.repo);
    const branch = githubData.default_branch;

    // Gather package.json files and README in parallel
    const [packageFiles, readme] = await Promise.all([
      gatherPackageFiles(parsed.owner, parsed.repo, branch),
      fetchFileContent(parsed.owner, parsed.repo, "README.md", branch).then(
        (r) => r || fetchFileContent(parsed.owner, parsed.repo, "readme.md", branch)
      ),
    ]);

    // AI analysis
    const analysis = await analyzeWithGemini(githubData, packageFiles, readme);

    // Upsert into cache
    const doc = await RepoAnalysis.findOneAndUpdate(
      { github_url: normalizedUrl },
      {
        github_url: normalizedUrl,
        repo_full_name: `${parsed.owner}/${parsed.repo}`,
        github_data: githubData,
        analysis,
        analyzed_at: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ ...doc.toObject(), cached: false });
  } catch (err) {
    console.error("[analyze]", err.message);
    return res.status(err.message.includes("not found") || err.message.includes("private") ? 404 : 500)
      .json({ error: err.message });
  }
};
