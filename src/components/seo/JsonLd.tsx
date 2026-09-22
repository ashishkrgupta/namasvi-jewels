import { BRAND } from "@/lib/constants";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        name: BRAND.name,
        description: BRAND.tagline,
        telephone: BRAND.phoneHref,
        email: BRAND.email,
        url: process.env.NEXT_PUBLIC_SITE_URL,
        image: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Keshavnagar, Mundhwa",
          addressLocality: "Pune",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
        sameAs: [BRAND.instagramUrl],
        priceRange: "₹₹",
      }}
    />
  );
}
