import { prisma } from "@/lib/prisma";
import { ProductTable } from "./table";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return <ProductTable products={products} />;
}
