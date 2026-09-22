"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ShoppingAssistant, WhatsAppButton } from "@/components/ai/ShoppingAssistant";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header announcement="Complimentary shipping on orders above ₹999" />
      <main id="main">{children}</main>
      <Footer />
      <CartDrawer />
      <ShoppingAssistant />
      <WhatsAppButton />
    </>
  );
}
