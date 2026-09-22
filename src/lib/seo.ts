import type { Metadata } from "next";
import { BRAND } from "./constants";
import { siteUrl } from "./utils";

export function createMetadata({
  title,
  description,
  path = "/",
  image,
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl()}${path}`;
  const ogImage = image || `${siteUrl()}/logo.png`;
  const fullTitle = title.includes(BRAND.name)
    ? title
    : `${title} | ${BRAND.name}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords ?? [
      "Artificial Jewellery Pune",
      "Fashion Jewellery Online",
      "Affordable Luxury Jewellery",
      "Bridal Jewellery Collection",
      "Trendy Earrings",
      "Designer Necklaces",
      "Premium Jewellery Store",
      "Namasvi Jewels",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BRAND.name,
      locale: "en_IN",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: BRAND.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
