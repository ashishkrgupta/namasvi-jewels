export const BRAND = {
  name: "Namasvi Jewels",
  founder: "Varsha Sahu",
  tagline: "Timeless Beauty. Everyday You.",
  phone: "9935940113",
  phoneHref: "+919935940113",
  email: "namasvijewels@gmail.com",
  instagram: "namasvi.jewels",
  instagramUrl: "https://instagram.com/namasvi.jewels",
  location: "Keshavnagar, Mundhwa, Pune",
  whatsapp: "919935940113",
  freeShippingFrom: 999,
} as const;

export const TRUST_POINTS = [
  { key: "quality", label: "Premium Quality" },
  { key: "luxury", label: "Affordable Luxury" },
  { key: "trendy", label: "Trendy Designs" },
  { key: "secure", label: "Secure Payments" },
  { key: "pune", label: "Hand-finished in Pune" },
  { key: "support", label: "Customer Support" },
] as const;

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/earrings", label: "Earrings" },
  { href: "/collections/necklaces", label: "Necklaces" },
  { href: "/collections/bridal-collection", label: "Bridal" },
  { href: "/collections/daily-wear", label: "Daily Wear" },
  { href: "/about", label: "Our Story" },
] as const;

export const OCCASIONS = [
  "Daily Wear",
  "Wedding",
  "Festive",
  "Party",
  "Gifting",
  "Office",
] as const;

export const MATERIALS = [
  "Gold Plated Alloy",
  "American Diamond",
  "Kundan",
  "Pearl",
  "Oxidised Metal",
  "Temple Jewellery",
] as const;

export const COLORS = [
  "Gold",
  "Rose Gold",
  "Silver",
  "Antique Gold",
  "Multicolor",
] as const;

export const SHIPPING_POLICY =
  "Orders ship from Pune within 1–2 business days. Complimentary shipping on orders above ₹999. Standard delivery: 3–6 business days across India.";

export const CARE_DEFAULT =
  "Store in a dry pouch, avoid perfume and water, and wipe with a soft cloth after wear to keep the finish luminous.";
