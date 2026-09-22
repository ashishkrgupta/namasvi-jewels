import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [products, collections] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.7 },
    ...collections.map((c) => ({
      url: `${base}/collections/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
