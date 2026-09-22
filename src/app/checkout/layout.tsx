import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Checkout",
  description: "Secure guest checkout for Namasvi Jewels. Pay with UPI, cards, net banking or wallets.",
  path: "/checkout",
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
