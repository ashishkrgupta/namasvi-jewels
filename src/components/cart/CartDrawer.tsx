"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { effectivePrice, formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();
  const shipping = subtotal >= BRAND.freeShippingFrom || subtotal === 0 ? 0 : 79;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-[60] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-[min(100%,420px)] flex-col bg-ivory shadow-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-champagne px-5 py-5">
              <div>
                <p className="font-serif text-2xl">Your bag</p>
                <p className="text-xs tracking-widest text-gold uppercase">
                  {items.length} piece{items.length === 1 ? "" : "s"}
                </p>
              </div>
              <button aria-label="Close cart" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="pt-12 text-center text-sm text-charcoal/70">
                  Your bag is waiting for something golden.
                </p>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4">
                      <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-mist">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-serif">{item.name}</p>
                        <p className="mt-1 text-sm">
                          {formatINR(effectivePrice(item.price, item.salePrice))}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            aria-label="Decrease"
                            onClick={() => setQty(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            aria-label="Increase"
                            onClick={() => setQty(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="ml-auto text-xs text-charcoal/50"
                            onClick={() => remove(item.productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-champagne px-5 py-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-charcoal/70">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Complimentary" : formatINR(shipping)}</span>
              </div>
              {subtotal > 0 && subtotal < BRAND.freeShippingFrom && (
                <p className="mt-3 text-xs text-gold">
                  Add {formatINR(BRAND.freeShippingFrom - subtotal)} for complimentary shipping.
                </p>
              )}
              <Button
                href={items.length ? "/checkout" : undefined}
                className="mt-4 w-full"
                disabled={!items.length}
                onClick={() => items.length && setOpen(false)}
              >
                Checkout
              </Button>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="mt-3 block text-center text-xs tracking-widest uppercase"
              >
                View bag
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
