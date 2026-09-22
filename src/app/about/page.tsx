import Image from "next/image";
import { StoreShell } from "@/components/layout/StoreShell";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { BRAND } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata = createMetadata({
  title: "Our Story",
  description:
    "Namasvi Jewels is a Pune jewellery studio creating affordable luxury pieces for daily wear, weddings, festivals and gifting.",
  path: "/about",
});

export default async function AboutPage() {
  const content = await prisma.siteContent.findUnique({ where: { key: "about" } });
  const value = (content?.value as { headline?: string; body?: string }) || {};

  return (
    <StoreShell>
      <div className="relative h-[46vh] min-h-[320px]">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=80"
          alt="Namasvi jewellery atelier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 lg:px-8">
            <p className="text-xs tracking-[0.28em] text-gold uppercase">The house of Namasvi</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl text-ivory md:text-6xl">
              {value.headline || "Made for the woman who dresses for her own life."}
            </h1>
          </div>
        </div>
      </div>
      <article className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <div className="mb-10 flex justify-center">
          <BrandLogo href="" size="xl" showWordmark={false} />
        </div>
        <p className="text-center font-serif text-sm italic text-[#5c1a28]/80">
          Namasvi Jewels by {BRAND.founder}
        </p>
        <p className="mt-8 text-lg leading-8 text-charcoal/85">
          {value.body ||
            "Namasvi Jewels began in Keshavnagar, Mundhwa — a Pune studio obsessed with the feeling of putting on something beautiful before an ordinary day."}
        </p>
        <p className="mt-6 leading-8 text-charcoal/80">
          We believe luxury should feel like a warm room, not a locked cabinet. Our pieces are
          designed as affordable luxury: gold-plated finishes, kundan and American diamond work,
          temple silhouettes, and daily-wear chains that survive real humidity, real commutes,
          real celebrations.
        </p>
        <p className="mt-6 leading-8 text-charcoal/80">
          Every order is quality-checked before it leaves Pune. We price with honesty, pack with
          care, and measure success by the message that says she wore it twice in one week.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            ["Passion", "Jewellery as a daily ritual, not a once-a-year costume."],
            ["Quality", "Hand-finished, photographed in-house, checked before dispatch."],
            ["Happiness", "Real humans on WhatsApp, studio-level care."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="font-serif text-2xl">{t}</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/75">{d}</p>
            </div>
          ))}
        </div>
      </article>
    </StoreShell>
  );
}
