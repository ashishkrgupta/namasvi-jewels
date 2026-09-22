import { prisma } from "./prisma";
import type { SearchIntent } from "./ai";
import type { Prisma } from "@prisma/client";

export function productInclude() {
  return {
    images: { orderBy: { sortOrder: "asc" as const } },
    videos: true,
    category: true,
    collection: true,
    reviews: {
      where: { status: "APPROVED" as const },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: "desc" as const },
    },
  };
}

export function listingWhere(params: {
  category?: string;
  collection?: string;
  color?: string;
  occasion?: string;
  material?: string;
  trending?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [];
  if (params.category) and.push({ category: { slug: params.category } });
  if (params.collection) and.push({ collection: { slug: params.collection } });
  if (params.color) and.push({ color: params.color });
  if (params.occasion) and.push({ occasion: { contains: params.occasion } });
  if (params.material) and.push({ material: { contains: params.material } });
  if (params.trending) and.push({ trending: true });
  if (params.newArrival) and.push({ newArrival: true });
  if (params.bestSeller) and.push({ bestSeller: true });
  if (params.minPrice || params.maxPrice) {
    and.push({
      OR: [
        { salePrice: { gte: params.minPrice, lte: params.maxPrice } },
        {
          AND: [
            { salePrice: null },
            { price: { gte: params.minPrice, lte: params.maxPrice } },
          ],
        },
      ],
    });
  }
  if (params.q) {
    and.push({
      OR: [
        { name: { contains: params.q } },
        { description: { contains: params.q } },
        { sku: { contains: params.q } },
        ...params.q
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => ({ tags: { array_contains: word } })),
      ],
    });
  }
  return and.length ? { AND: and } : {};
}

export function listingOrder(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "newest":
      return { createdAt: "desc" };
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    default:
      return { bestSeller: "desc" };
  }
}

export async function searchByIntent(intent: SearchIntent) {
  const where = listingWhere({
    category: intent.category,
    color: intent.color,
    occasion: intent.occasion,
    trending: intent.trending,
    newArrival: intent.newArrival,
    bestSeller: intent.bestSeller,
    minPrice: intent.minPrice,
    maxPrice: intent.maxPrice,
    q: !intent.category && !intent.occasion ? intent.query : undefined,
  });

  return prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
      category: true,
      collection: true,
    },
    orderBy: [{ bestSeller: "desc" }, { trending: "desc" }],
    take: 24,
  });
}

export async function recommendProducts(opts: {
  productId?: string;
  userId?: string;
}) {
  if (opts.productId) {
    const product = await prisma.product.findUnique({
      where: { id: opts.productId },
    });
    if (product) {
      return prisma.product.findMany({
        where: {
          id: { not: product.id },
          OR: [
            { categoryId: product.categoryId },
            { collectionId: product.collectionId || undefined },
            { occasion: product.occasion },
          ],
        },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        take: 8,
      });
    }
  }

  if (opts.userId) {
    const orders = await prisma.order.findMany({
      where: { userId: opts.userId },
      include: { items: true },
      take: 10,
    });
    const purchased = orders.flatMap((o) => o.items.map((i) => i.productId));
    if (purchased.length) {
      const last = await prisma.product.findUnique({
        where: { id: purchased[0] },
      });
      return prisma.product.findMany({
        where: {
          id: { notIn: purchased },
          categoryId: last?.categoryId,
        },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        take: 8,
      });
    }
  }

  return prisma.product.findMany({
    where: { bestSeller: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    take: 8,
  });
}
