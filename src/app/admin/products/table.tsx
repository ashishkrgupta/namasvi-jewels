"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
};

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl">Products</h1>
        <Button href="/admin/products/new">Add product</Button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="text-xs tracking-widest text-gold uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-champagne">
                <td className="px-4 py-3">{p.name}</td>
                <td>{p.sku}</td>
                <td>{formatINR(p.salePrice || p.price)}</td>
                <td>{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="mr-3 text-gold">
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this product?")) return;
                      await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
                      toast("Product deleted");
                      router.refresh();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
