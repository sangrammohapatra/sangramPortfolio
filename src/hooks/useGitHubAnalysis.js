import { useState, useCallback } from "react";

export function useGitHubAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (githubUrl) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: githubUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, analyze, reset };
}
