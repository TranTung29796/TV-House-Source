"use client";

import { useCallback, useState } from "react";
import type { AuthUser } from "../client/server";

export function useUser(initialUser?: AuthUser | null) {
  const [user, setUser] = useState<AuthUser | null>(initialUser ?? null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/auth/me", { cache: "no-store" }).catch(() => null);
    if (!response?.ok) {
      setUser(null);
      setLoading(false);
      return;
    }
    const payload = await response.json().catch(() => null);
    setUser(payload?.user ?? null);
    setLoading(false);
  }, []);

  return { user, loading, refresh };
}
