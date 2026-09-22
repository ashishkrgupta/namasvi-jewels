"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { discountPercent, effectivePrice, formatINR } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { toast } from "@/components/ui/Toaster";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  images: { url: string; alt: string }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const image = product.images[0];
  const discount = discountPercent(product.price, product.salePrice);
  const price = effectivePrice(product.price, product.salePrice);

  return (
    <article className="group rounded-3xl bg-white p-3 shadow-soft">
      <div className="relative overflow-hidden rounded-2xl bg-mist">
        <Link href={`/product/${product.slug}`} className="block aspect-[4/5]">
          {image && (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          )}
        </Link>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] tracking-widest text-gold uppercase">
            {discount}% off
          </span>
        )}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <button
            aria-label="Wishlist"
            className="rounded-full bg-white/90 p-2 shadow-soft"
            onClick={() => {
              toggle({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: image?.url || "",
                price: product.price,
                salePrice: product.salePrice,
              });
              toast(wished ? "Removed from wishlist" : "Saved to wishlist");
            }}
          >
            <Heart className={`h-4 w-4 ${wished ? "fill-gold text-gold" : ""}`} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            aria-label="Quick view"
            className="rounded-full bg-white/90 p-2 shadow-soft"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="px-2 pb-2 pt-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg leading-snug text-ink">{product.name}</h3>
        </Link>
        <p className="mt-2 flex items-baseline gap-2 text-sm">
          <span className="font-medium text-ink">{formatINR(price)}</span>
          {product.salePrice && product.salePrice < product.price && (
            <span className="text-charcoal/45 line-through">{formatINR(product.price)}</span>
          )}
        </p>
        <button
          className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-gold uppercase"
          onClick={() => {
            add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: image?.url || "",
              price: product.price,
              salePrice: product.salePrice,
              stock: product.stock,
            });
            toast("Added to bag");
          }}
        >
          <ShoppingBag className="h-3.5 w-3.5" /> Add to cart
        </button>
      </div>
    </article>
  );
}
