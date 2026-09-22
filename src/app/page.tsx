import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StoreShell } from "@/components/layout/StoreShell";
import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/product/ProductCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { TRUST_POINTS } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Namasvi Jewels | Timeless Beauty. Everyday You.",
  description:
    "Affordable luxury jewellery in Pune. Shop trendy earrings, designer necklaces, bridal sets and daily wear from Namasvi Jewels.",
  path: "/",
});

const STORIES = [
  {
    quote:
      "I wore the chandbalis for my sister’s pheras and felt like myself — dressed, not costumed.",
    name: "Ananya Sharma",
    city: "Kalyani Nagar, Pune",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    quote:
      "Daily studs that survive office hours and still look considered at dinner. That is rare.",
    name: "Meera Iyer",
    city: "Mundhwa",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    quote:
      "Gifted a pendant. The box, the note, the piece — it felt like a boutique, not a marketplace.",
    name: "Riya Kapoor",
    city: "Viman Nagar",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
];

export default async function HomePage() {
  const [banner, collections, bestsellers, photoReviews] = await Promise.all([
    prisma.banner.findFirst({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.collection.findMany({ where: { featured: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { bestSeller: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      take: 8,
    }),
    prisma.review.findMany({
      where: { status: "APPROVED", photoUrl: { not: null } },
      include: { user: true, product: true },
      take: 6,
    }),
  ]);

  return (
    <StoreShell>
      <Hero
        image={
          banner?.image ||
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=80"
        }
        title={banner?.title || "Jewelry That Celebrates Every Moment"}
        subtitle={
          banner?.subtitle ||
          "Premium quality designs crafted to make every day feel special."
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {TRUST_POINTS.map((t) => (
            <div
              key={t.key}
              className="flex items-center gap-3 rounded-2xl border border-champagne bg-white px-4 py-4 text-sm"
            >
              <Check className="h-4 w-4 text-gold" />
              {t.label}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-gold uppercase">Collections</p>
            <h2 className="mt-2 font-serif text-4xl text-ink">Find your occasion</h2>
          </div>
          <Link href="/shop" className="hidden text-xs tracking-[0.2em] uppercase sm:block">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="group relative min-h-[340px] overflow-hidden rounded-[2rem] bg-mist shadow-soft"
            >
              {c.image && (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-serif text-3xl text-ivory">{c.name}</h3>
                <p className="mt-2 max-w-xs text-sm text-champagne">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">Best sellers</p>
        <h2 className="mt-2 font-serif text-4xl text-ink">Loved, then worn again</h2>
        <div className="mt-10 flex gap-5 overflow-x-auto pb-4">
          {bestsellers.map((p) => (
            <div key={p.id} className="min-w-[260px] max-w-[280px] flex-1">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs tracking-[0.28em] text-gold uppercase">Why women love Namasvi</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              Luxury that knows your weekday, and your wedding.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-champagne">
              We design from Pune for the woman who wants gold-light jewellery that feels
              intimate, not intimidating. Every piece is quality-checked, priced as affordable
              luxury, and made to be worn — to the office, to aarti, to the photograph you keep.
            </p>
          </div>
          <div className="grid gap-4">
            {STORIES.map((s) => (
              <article key={s.name} className="flex gap-4 rounded-3xl bg-white/5 p-5">
                <Image
                  src={s.image}
                  alt={s.name}
                  width={72}
                  height={72}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-serif text-lg leading-snug">“{s.quote}”</p>
                  <p className="mt-2 text-xs tracking-widest text-gold uppercase">
                    {s.name} · {s.city}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-gold uppercase">@namasvi.jewels</p>
            <h2 className="mt-2 font-serif text-4xl">Shoppable moments</h2>
          </div>
          <a
            href="https://instagram.com/namasvi.jewels"
            className="text-xs tracking-[0.2em] uppercase"
            target="_blank"
            rel="noreferrer"
          >
            Follow
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {bestsellers.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="relative aspect-square overflow-hidden rounded-3xl"
            >
              {p.images[0] && (
                <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
              )}
            </Link>
          ))}
        </div>
      </section>

      {photoReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8 lg:px-8">
          <p className="text-xs tracking-[0.28em] text-gold uppercase">Verified photo reviews</p>
          <h2 className="mt-2 font-serif text-4xl">Seen on real days</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photoReviews.map((r) => (
              <article key={r.id} className="overflow-hidden rounded-3xl bg-white shadow-soft">
                {r.photoUrl && (
                  <div className="relative h-56">
                    <Image src={r.photoUrl} alt={r.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-gold">{"★".repeat(r.rating)}</p>
                  <p className="mt-2 font-serif text-xl">{r.title}</p>
                  <p className="mt-2 text-sm leading-6 text-charcoal/80">{r.body}</p>
                  <p className="mt-3 text-xs tracking-widest text-gold uppercase">
                    {r.user.name} · Verified purchase
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto my-16 max-w-4xl rounded-[2.5rem] bg-mist px-6 py-16 text-center lg:px-16">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">Private list</p>
        <h2 className="mt-3 font-serif text-4xl">Get Exclusive Launches & Special Offers</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-charcoal/75">
          Be first to the festive drops, bridal previews, and studio notes from Pune.
        </p>
        <div className="mx-auto max-w-lg">
          <NewsletterForm />
        </div>
      </section>
    </StoreShell>
  );
}
