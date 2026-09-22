"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";

export function ContentForm({
  announcement,
  about,
  promo,
  banner,
}: {
  announcement?: string;
  about?: { headline?: string; body?: string };
  promo?: { text?: string };
  banner?: { title?: string; subtitle?: string; image?: string };
}) {
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        announcement: fd.get("announcement"),
        about: { headline: fd.get("headline"), body: fd.get("body") },
        promo: { text: fd.get("promo") },
        banner: {
          title: fd.get("bannerTitle"),
          subtitle: fd.get("bannerSubtitle"),
          image: fd.get("bannerImage"),
          ctaText: "Shop Collection",
          ctaHref: "/shop",
        },
      }),
    });
    toast(res.ok ? "Content published" : "Could not save");
  }

  const field = "w-full rounded-2xl border border-champagne px-4 py-3 text-sm";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 rounded-[2rem] bg-white p-6 shadow-soft">
      <h1 className="font-serif text-3xl">Content</h1>
      <p className="text-sm text-charcoal/70">Update storefront copy without deploying code.</p>
      <input name="announcement" defaultValue={announcement} placeholder="Announcement bar" className={field} />
      <input name="bannerTitle" defaultValue={banner?.title} placeholder="Hero headline" className={field} />
      <input name="bannerSubtitle" defaultValue={banner?.subtitle} placeholder="Hero subheadline" className={field} />
      <input name="bannerImage" defaultValue={banner?.image} placeholder="Hero image URL" className={field} />
      <input name="headline" defaultValue={about?.headline} placeholder="About headline" className={field} />
      <textarea name="body" defaultValue={about?.body} rows={5} placeholder="About story" className={field} />
      <input name="promo" defaultValue={promo?.text} placeholder="Promotional announcement" className={field} />
      <Button type="submit">Publish</Button>
    </form>
  );
}
