// Vercel serverless functions receive req.body pre-parsed when Content-Type is application/json
// This helper ensures it's always available
module.exports = function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve(); // already parsed by Vercel
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      try { req.body = JSON.parse(data); } catch { req.body = {}; }
      resolve();
    });
  });
};
