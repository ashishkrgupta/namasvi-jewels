import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductCard } from "@/components/product/ProductCard";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return createMetadata({ title: "Collection", description: "Namasvi collection" });
  return createMetadata({
    title: collection.name,
    description: collection.description || `${collection.name} jewellery from Namasvi Jewels.`,
    path: `/collections/${slug}`,
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } },
    },
  });
  if (!collection) notFound();

  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">Collection</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{collection.name}</h1>
        <p className="mt-4 max-w-2xl text-charcoal/75">{collection.description}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collection.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </StoreShell>
  );
}
