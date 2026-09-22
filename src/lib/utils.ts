import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(price: number, salePrice?: number | null) {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function effectivePrice(price: number, salePrice?: number | null) {
  return salePrice && salePrice < price ? salePrice : price;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function orderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `NJ${n}`;
}

export function otpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
