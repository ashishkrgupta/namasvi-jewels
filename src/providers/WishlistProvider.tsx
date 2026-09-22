"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type WishItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
};

type WishlistContextValue = {
  items: WishItem[];
  has: (productId: string) => boolean;
  toggle: (item: WishItem) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const KEY = "namasvi-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([]);

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

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      has: (id) => items.some((i) => i.productId === id),
      toggle: (item) =>
        setItems((prev) =>
          prev.some((i) => i.productId === item.productId)
            ? prev.filter((i) => i.productId !== item.productId)
            : [...prev, item],
        ),
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
