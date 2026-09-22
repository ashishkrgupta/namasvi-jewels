import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError, jsonError } from "@/lib/api";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const products = await prisma.product.findMany({
      include: { images: true, category: true, collection: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (e) {
    return handleError(e);
  }
}

const schema = z.object({
  name: z.string().min(2),
  sku: z.string().min(3),
  description: z.string().min(10),
  material: z.string(),
  care: z.string().optional(),
  occasion: z.string(),
  color: z.string(),
  price: z.number(),
  salePrice: z.number().nullable().optional(),
  stock: z.number(),
  weight: z.number().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string(),
  collectionId: z.string().optional(),
  images: z.array(z.string()).min(1),
  trending: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());
    const exists = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (exists) return jsonError("SKU already exists.");
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        sku: data.sku,
        description: data.description,
        material: data.material,
        care: data.care || "Store dry, avoid perfume and water.",
        occasion: data.occasion,
        color: data.color,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock,
        weight: data.weight,
        tags: data.tags || [],
        categoryId: data.categoryId,
        collectionId: data.collectionId,
        trending: data.trending,
        newArrival: data.newArrival,
        bestSeller: data.bestSeller,
        images: {
          create: data.images.map((url, i) => ({
            url,
            alt: data.name,
            sortOrder: i,
          })),
        },
      },
    });
    return NextResponse.json({ product });
  } catch (e) {
    return handleError(e);
  }
}
