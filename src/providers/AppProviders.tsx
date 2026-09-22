"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { WishlistProvider } from "./WishlistProvider";
import { Toaster } from "@/components/ui/Toaster";

function AnalyticsBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page_view", path: pathname }),
    }).catch(() => undefined);
  }, [pathname]);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <Toaster />
          <AnalyticsBeacon />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
