import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: true } }),
    prisma.category.findMany(),
    prisma.collection.findMany(),
  ]);
  if (!product) notFound();
  return <ProductForm categories={categories} collections={collections} product={product} />;
}
