"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      toast("Welcome to the inner circle.");
      setEmail("");
    } else {
      toast("Please use a valid email.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 rounded-full border border-champagne bg-white px-5 py-3 text-sm outline-none"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
