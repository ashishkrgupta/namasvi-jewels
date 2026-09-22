import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { BRAND } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { AppProviders } from "@/providers/AppProviders";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata({
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description:
      "Premium affordable luxury jewellery from Pune. Shop trendy earrings, designer necklaces, bridal sets and daily wear at Namasvi Jewels.",
    path: "/",
  }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  category: "shopping",
  robots: { index: true, follow: true },
  icons: { icon: "/icon.png", apple: "/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] gold-btn rounded-full px-4 py-2 text-sm"
        >
          Skip to content
        </a>
        <GoogleAnalytics />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
