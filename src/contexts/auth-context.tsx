'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LedUser } from "@/types/led";

type AuthContextValue = {
  user: LedUser | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function handleJsonResponse(res: Response) {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (payload as any)?.error || "Request failed";
    throw new Error(typeof message === "string" ? message : "Request failed");
  }
  return payload;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data?.user ?? null);
    } catch (err) {
      console.error("Failed to refresh session", err);
      setError(err instanceof Error ? err.message : "Failed to refresh session");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (identifier: string, password: string) => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ identifier, password }),
    });
    const data = await handleJsonResponse(res);
    setUser(data.user ?? null);
  }, []);

  const register = useCallback(
    async ({ username, email, password }: { username: string; email: string; password: string }) => {
      setError(null);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      const data = await handleJsonResponse(res);
      setUser(data.user ?? null);
    },
    []
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      login: async (identifier, password) => {
        await login(identifier, password);
      },
      register: async (payload) => {
        await register(payload);
      },
      logout: async () => {
        await logout();
      },
      refresh,
    }),
    [user, loading, error, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

