import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { listingOrder, listingWhere } from "@/lib/catalog";
import { parseNaturalSearch } from "@/lib/ai";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "./filters";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shop Fashion Jewellery Online",
  description:
    "Shop affordable luxury jewellery online — trendy earrings, designer necklaces, bridal sets and daily wear from Namasvi Jewels, Pune.",
  path: "/shop",
  keywords: [
    "Fashion Jewellery Online",
    "Affordable Luxury Jewellery",
    "Trendy Earrings",
    "Designer Necklaces",
    "Artificial Jewellery Pune",
  ],
});

type Search = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const q = first(sp.q);
  const intent = q ? parseNaturalSearch(q) : null;
  const where = listingWhere({
    category: first(sp.category) || intent?.category,
    color: first(sp.color) || intent?.color,
    occasion: first(sp.occasion) || intent?.occasion,
    material: first(sp.material),
    trending: first(sp.trending) === "1" || intent?.trending,
    newArrival: first(sp.newArrival) === "1" || intent?.newArrival,
    bestSeller: first(sp.bestSeller) === "1" || intent?.bestSeller,
    minPrice: first(sp.minPrice)
      ? Number(first(sp.minPrice))
      : intent?.minPrice,
    maxPrice: first(sp.maxPrice)
      ? Number(first(sp.maxPrice))
      : intent?.maxPrice,
    q: intent?.category || intent?.occasion || intent?.maxPrice ? undefined : q,
  });

  const [initialProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: listingOrder(first(sp.sort)),
    }),
    prisma.category.findMany(),
  ]);

  const products =
    initialProducts.length || !intent
      ? initialProducts
      : await prisma.product.findMany({
          where: listingWhere({
            category: intent.category,
            minPrice: intent.minPrice,
            maxPrice: intent.maxPrice,
            color: intent.color,
          }),
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          orderBy: listingOrder(first(sp.sort)),
        });

  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">The atelier</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Shop jewellery</h1>
        {q && (
          <p className="mt-3 text-sm text-charcoal/70">
            Showing results for “{q}”
          </p>
        )}
        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
          <div>
            {products.length === 0 ? (
              <p className="rounded-3xl bg-white p-10 text-center shadow-soft">
                No pieces match those filters. Try a wider budget or another occasion.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
