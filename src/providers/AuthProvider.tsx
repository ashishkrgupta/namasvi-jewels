"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SessionUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  avatar: string | null;
};

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setUser(data.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refresh,
      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
