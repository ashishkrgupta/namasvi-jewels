"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";

export function MarketingTools({
  campaigns,
  abandoned,
  segments,
}: {
  campaigns: { id: string; type: string; subject: string; recipients: number; segment: string }[];
  abandoned: { id: string; user: { name: string; phone: string | null }; product: { name: string } }[];
  segments: { key: string; count: number }[];
}) {
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: fd.get("type"),
        subject: fd.get("subject"),
        body: fd.get("body"),
        segment: fd.get("segment"),
      }),
    });
    toast(res.ok ? "Campaign queued & marked sent" : "Failed");
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl">Marketing</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {segments.map((s) => (
          <div key={s.key} className="rounded-3xl bg-white p-5 shadow-soft">
            <p className="text-xs tracking-widest text-gold uppercase">{s.key}</p>
            <p className="mt-2 font-serif text-3xl">{s.count}</p>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="space-y-3 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-serif text-2xl">WhatsApp & email campaigns</h2>
        <select name="type" className="rounded-2xl border border-champagne px-4 py-2 text-sm">
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
        </select>
        <select name="segment" className="ml-2 rounded-2xl border border-champagne px-4 py-2 text-sm">
          <option value="all">All customers</option>
          <option value="new">New</option>
          <option value="repeat">Repeat buyers</option>
        </select>
        <input name="subject" required placeholder="Subject / campaign name" className="block w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
        <textarea name="body" required rows={4} placeholder="Message" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
        <Button type="submit">Send campaign</Button>
      </form>
      <section>
        <h2 className="font-serif text-2xl">Abandoned carts</h2>
        <ul className="mt-3 space-y-2">
          {abandoned.length === 0 && <p className="text-sm text-charcoal/60">No abandoned carts yet.</p>}
          {abandoned.map((a) => (
            <li key={a.id} className="rounded-2xl bg-white px-4 py-3 text-sm shadow-soft">
              {a.user.name} left {a.product.name} · {a.user.phone || "no phone"}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-2xl">Recent campaigns</h2>
        <ul className="mt-3 space-y-2">
          {campaigns.map((c) => (
            <li key={c.id} className="rounded-2xl bg-white px-4 py-3 text-sm shadow-soft">
              {c.type} · {c.subject} · {c.recipients} {c.segment}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
