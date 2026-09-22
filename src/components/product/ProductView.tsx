"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { discountPercent, effectivePrice, formatINR } from "@/lib/utils";

type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  description: string;
  material: string;
  care: string;
  occasion: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: { url: string; alt: string }[];
  videos: { url: string; title: string | null }[];
};

export function ProductView({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const price = effectivePrice(product.price, product.salePrice);
  const off = discountPercent(product.price, product.salePrice);
  const image = product.images[active];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-mist"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({
              on: true,
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            });
          }}
          onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
        >
          {image && (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{
                transform: zoom.on ? "scale(1.85)" : "scale(1)",
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transition: zoom.on ? "none" : "transform 300ms",
              }}
            />
          )}
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {product.images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 overflow-hidden rounded-2xl ${
                i === active ? "ring-2 ring-gold" : ""
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
        {product.videos[0] && (
          <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-ink">
            <iframe
              title={product.videos[0].title || "Product video"}
              src={product.videos[0].url}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      <div>
        <p className="text-xs tracking-[0.28em] text-gold uppercase">{product.occasion}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
        <p className="mt-2 text-xs tracking-widest text-charcoal/50">SKU {product.sku}</p>
        <p className="mt-5 flex items-baseline gap-3">
          <span className="font-serif text-3xl">{formatINR(price)}</span>
          {off > 0 && (
            <>
              <span className="text-charcoal/40 line-through">{formatINR(product.price)}</span>
              <span className="rounded-full bg-mist px-2 py-1 text-xs text-gold">{off}% off</span>
            </>
          )}
        </p>
        <p className="mt-6 max-w-lg text-sm leading-7 text-charcoal/80">{product.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={() => {
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0]?.url || "",
                price: product.price,
                salePrice: product.salePrice,
                stock: product.stock,
              });
              toast("Added to bag");
            }}
          >
            Add to cart
          </Button>
          <Button
            size="lg"
            variant="line"
            onClick={() => {
              toggle({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0]?.url || "",
                price: product.price,
                salePrice: product.salePrice,
              });
              toast(wished ? "Removed from wishlist" : "Saved to wishlist");
            }}
          >
            <Heart className={`mr-2 h-4 w-4 ${wished ? "fill-gold text-gold" : ""}`} />
            Wishlist
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) await navigator.share({ title: product.name, url });
              else {
                await navigator.clipboard.writeText(url);
                toast("Link copied");
              }
            }}
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>

        <dl className="mt-10 space-y-4 border-t border-champagne pt-8 text-sm">
          <div>
            <dt className="tracking-[0.18em] text-gold uppercase">Material</dt>
            <dd className="mt-1">{product.material}</dd>
          </div>
          <div>
            <dt className="tracking-[0.18em] text-gold uppercase">Occasion</dt>
            <dd className="mt-1">{product.occasion}</dd>
          </div>
          <div>
            <dt className="tracking-[0.18em] text-gold uppercase">Care</dt>
            <dd className="mt-1 leading-7">{product.care}</dd>
          </div>
          <div>
            <dt className="tracking-[0.18em] text-gold uppercase">Shipping</dt>
            <dd className="mt-1 leading-7">
              Ships from Pune in 1–2 days. Complimentary above ₹999.
            </dd>
          </div>
        </dl>

        <ul className="mt-8 grid gap-2 text-sm sm:grid-cols-3">
          {["Quality Checked", "Secure Checkout", "Hand-finished in Pune"].map((b) => (
            <li key={b} className="rounded-full bg-mist px-4 py-2 text-center">
              ✓ {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
