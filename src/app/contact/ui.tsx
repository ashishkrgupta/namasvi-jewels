"use client";

import { FormEvent, useState } from "react";
import { StoreShell } from "@/components/layout/StoreShellClient";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { BRAND } from "@/lib/constants";

export function ContactPageClient() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    setLoading(false);
    if (res.ok) {
      toast("Message received. We’ll write back soon.");
      e.currentTarget.reset();
    } else toast("Please complete the form.");
  }

  return (
    <StoreShell>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs tracking-[0.28em] text-gold uppercase">Keshavnagar studio</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Contact Namasvi</h1>
          <ul className="mt-8 space-y-3 text-sm leading-7">
            <li>
              Phone:{" "}
              <a className="text-gold" href={`tel:${BRAND.phoneHref}`}>
                {BRAND.phone}
              </a>
            </li>
            <li>
              Email:{" "}
              <a className="text-gold" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a className="text-gold" href={BRAND.instagramUrl}>
                @{BRAND.instagram}
              </a>
            </li>
            <li>Location: {BRAND.location}</li>
          </ul>
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            className="mt-6 inline-block rounded-full bg-[#25D366] px-6 py-3 text-xs tracking-[0.18em] text-white uppercase"
          >
            WhatsApp us
          </a>
          <div className="mt-8 overflow-hidden rounded-[2rem] shadow-soft">
            <iframe
              title="Namasvi Jewels on Google Maps"
              src="https://maps.google.com/maps?q=Keshavnagar%20Mundhwa%20Pune&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] bg-white p-7 shadow-soft">
          <h2 className="font-serif text-2xl">Write to the studio</h2>
          <input name="name" required placeholder="Name" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          <input name="phone" placeholder="Phone" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          <textarea name="message" required rows={5} placeholder="How can we help?" className="w-full rounded-2xl border border-champagne px-4 py-3 text-sm" />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </StoreShell>
  );
}
