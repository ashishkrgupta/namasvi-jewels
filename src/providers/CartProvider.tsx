"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { effectivePrice } from "@/lib/utils";

export type CartEntry = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  items: CartEntry[];
  add: (item: Omit<CartEntry, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "namasvi-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (item, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((p) => p.productId === item.productId);
        if (existing) {
          return prev.map((p) =>
            p.productId === item.productId
              ? { ...p, quantity: Math.min(p.stock, p.quantity + qty) }
              : p,
          );
        }
        return [...prev, { ...item, quantity: qty }];
      });
      setOpen(true);
    };

    return {
      items,
      add,
      remove: (productId) => setItems((prev) => prev.filter((p) => p.productId !== productId)),
      setQty: (productId, quantity) =>
        setItems((prev) =>
          prev
            .map((p) =>
              p.productId === productId
                ? { ...p, quantity: Math.max(1, Math.min(p.stock, quantity)) }
                : p,
            )
            .filter((p) => p.quantity > 0),
        ),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce(
        (s, i) => s + effectivePrice(i.price, i.salePrice) * i.quantity,
        0,
      ),
      open,
      setOpen,
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
