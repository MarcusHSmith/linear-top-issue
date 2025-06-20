"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
  avatarUrl: string;
  url: string;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/linear/get-user");
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        setUser(data || null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading, error };
}
