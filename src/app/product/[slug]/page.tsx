import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productInclude, recommendProducts } from "@/lib/catalog";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductView } from "@/components/product/ProductView";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";
import { effectivePrice, siteUrl } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true },
  });
  if (!product) return createMetadata({ title: "Product", description: "Namasvi jewellery" });
  return createMetadata({
    title: product.name,
    description: product.description.slice(0, 160),
    path: `/product/${slug}`,
    image: product.images[0]?.url,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productInclude(),
  });
  if (!product) notFound();
  const related = await recommendProducts({ productId: product.id });
  const price = effectivePrice(product.price, product.salePrice);

  return (
    <StoreShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          sku: product.sku,
          image: product.images.map((i) => i.url),
          brand: { "@type": "Brand", name: "Namasvi Jewels" },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price,
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: `${siteUrl()}/product/${product.slug}`,
          },
          aggregateRating: product.reviews.length
            ? {
                "@type": "AggregateRating",
                ratingValue: (
                  product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
                ).toFixed(1),
                reviewCount: product.reviews.length,
              }
            : undefined,
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <ProductView product={product} />

        {product.reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-3xl">Customer reviews</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {product.reviews.map((r) => (
                <article key={r.id} className="rounded-3xl bg-white p-5 shadow-soft">
                  <p className="text-gold">{"★".repeat(r.rating)}</p>
                  <p className="mt-2 font-serif text-xl">{r.title}</p>
                  <p className="mt-2 text-sm leading-6">{r.body}</p>
                  <p className="mt-3 text-xs tracking-widest text-gold uppercase">
                    {r.user.name}
                    {r.verified ? " · Verified purchase" : ""}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="font-serif text-3xl">You may also love</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </StoreShell>
  );
}
