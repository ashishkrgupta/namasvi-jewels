import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ShoppingAssistant, WhatsAppButton } from "@/components/ai/ShoppingAssistant";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

export async function StoreShell({ children }: { children: React.ReactNode }) {
  const announcement = await prisma.announcement.findFirst({
    where: { active: true },
  });

  return (
    <>
      <LocalBusinessJsonLd />
      <Header announcement={announcement?.message} />
      <main id="main">{children}</main>
      <Footer />
      <CartDrawer />
      <ShoppingAssistant />
      <WhatsAppButton />
    </>
  );
}
