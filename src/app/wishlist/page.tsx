"use client";

import Link from "next/link";
import { StoreShell } from "@/components/layout/StoreShellClient";
import { useWishlist } from "@/providers/WishlistProvider";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlist();
  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h1 className="font-serif text-4xl">Wishlist</h1>
        {items.length === 0 ? (
          <p className="mt-6 text-charcoal/70">
            Nothing saved yet. <Link href="/shop" className="text-gold">Browse jewellery</Link>
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <ProductCard
                key={item.productId}
                product={{
                  id: item.productId,
                  slug: item.slug,
                  name: item.name,
                  price: item.price,
                  salePrice: item.salePrice,
                  stock: 9,
                  images: [{ url: item.image, alt: item.name }],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
