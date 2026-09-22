import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { slugify } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.name ? slugify(body.name) : undefined,
        sku: body.sku,
        description: body.description,
        material: body.material,
        care: body.care,
        occasion: body.occasion,
        color: body.color,
        price: body.price,
        salePrice: body.salePrice,
        stock: body.stock,
        weight: body.weight,
        tags: body.tags,
        categoryId: body.categoryId,
        collectionId: body.collectionId,
        trending: body.trending,
        newArrival: body.newArrival,
        bestSeller: body.bestSeller,
      },
    });
    if (Array.isArray(body.images) && body.images.length) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: body.images.map((url: string, i: number) => ({
          url,
          alt: product.name,
          sortOrder: i,
          productId: id,
        })),
      });
    }
    return NextResponse.json({ product });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
