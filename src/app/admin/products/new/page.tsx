import { prisma } from "@/lib/prisma";
import { ProductForm } from "../form";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany(),
    prisma.collection.findMany(),
  ]);
  return <ProductForm categories={categories} collections={collections} />;
}
