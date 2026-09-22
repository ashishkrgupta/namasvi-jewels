"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShellClient";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { useAuth } from "@/providers/AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/account";
  const { refresh } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");

  async function onPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error || "Could not continue");
    await refresh();
    router.push(next);
  }

  async function sendOtp() {
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error || "Could not send OTP");
    setOtpSent(true);
    toast(data.demoCode ? `Demo OTP: ${data.demoCode}` : "OTP sent");
  }

  async function verifyOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code: fd.get("code"), name: fd.get("name") }),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error || "Invalid OTP");
    await refresh();
    router.push(next);
  }

  return (
    <StoreShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-4xl">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          {mode === "login" ? (
            <>
              New here? <Link className="text-gold" href="/register">Register</Link>
            </>
          ) : (
            <>
              Already with us? <Link className="text-gold" href="/login">Login</Link>
            </>
          )}
        </p>
        <form onSubmit={onPassword} className="mt-8 space-y-3 rounded-[2rem] bg-white p-6 shadow-soft">
          {mode === "register" && (
            <input name="name" required placeholder="Full name" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          )}
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          {mode === "register" && (
            <input name="phone" placeholder="Phone" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          )}
          <input name="password" type="password" required placeholder="Password" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          <Button type="submit" className="w-full">
            {mode === "login" ? "Login" : "Register"}
          </Button>
        </form>

        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-xs tracking-[0.2em] text-gold uppercase">OTP login</p>
          <div className="mt-3 flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="flex-1 rounded-2xl border border-champagne px-4 py-3 text-sm"
            />
            <Button type="button" variant="line" onClick={sendOtp}>
              Send
            </Button>
          </div>
          {otpSent && (
            <form onSubmit={verifyOtp} className="mt-3 space-y-3">
              {mode === "register" && (
                <input name="name" placeholder="Name" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
              )}
              <input name="code" required placeholder="6-digit OTP" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
            </form>
          )}
        </div>
      </div>
    </StoreShell>
  );
}
