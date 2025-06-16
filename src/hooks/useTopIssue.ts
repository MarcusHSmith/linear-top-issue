import { useEffect, useState } from "react";

export function useTopIssue() {
  const [topIssue, setTopIssue] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopIssue() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/linear/top-issue");
        if (!res.ok) {
          throw new Error("Failed to fetch top issue");
        }
        const data = await res.json();
        setTopIssue(data.topIssue || null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchTopIssue();
  }, []);

  return { topIssue, loading, error };
}
