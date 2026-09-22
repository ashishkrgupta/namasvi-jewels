"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { useAuth } from "@/providers/AuthProvider";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast(data.error || "Login failed");
    if (data.user?.role !== "ADMIN") return toast("This account is not an admin.");
    await refresh();
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-[2rem] bg-ivory p-8 shadow-soft">
        <BrandLogo href="/" />
        <p className="mt-6 text-xs tracking-[0.28em] text-gold uppercase">Studio</p>
        <h1 className="mt-2 font-serif text-4xl">Namasvi Admin</h1>
        <input
          name="email"
          type="email"
          required
          defaultValue="ivan.p@example.net"
          className="mt-8 w-full rounded-2xl border border-champagne px-4 py-3 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          defaultValue="Admin@123"
          className="mt-3 w-full rounded-2xl border border-champagne px-4 py-3 text-sm"
        />
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : "Enter dashboard"}
        </Button>
      </form>
    </div>
  );
}
