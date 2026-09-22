"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreShell } from "@/components/layout/StoreShellClient";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { effectivePrice, formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

export default function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const shipping = subtotal >= BRAND.freeShippingFrom || !subtotal ? 0 : 79;

  return (
    <StoreShell>
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <h1 className="font-serif text-4xl">Your bag</h1>
        {items.length === 0 ? (
          <p className="mt-8 text-charcoal/70">
            Empty for now.{" "}
            <Link href="/shop" className="text-gold">
              Discover the collection
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 rounded-3xl bg-white p-4 shadow-soft">
                  <div className="relative h-28 w-24 overflow-hidden rounded-2xl">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.slug}`} className="font-serif text-xl">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm">
                      {formatINR(effectivePrice(item.price, item.salePrice))}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        aria-label="Quantity"
                        className="w-16 rounded-full border border-champagne px-3 py-1"
                        onChange={(e) => setQty(item.productId, Number(e.target.value))}
                      />
                      <button onClick={() => remove(item.productId)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="font-serif text-2xl">Summary</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping ? formatINR(shipping) : "Complimentary"}</span>
              </div>
              <div className="mt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatINR(subtotal + shipping)}</span>
              </div>
              <Button href="/checkout" className="mt-6 w-full">
                Checkout
              </Button>
            </aside>
          </div>
        )}
      </div>
    </StoreShell>
  );
}
