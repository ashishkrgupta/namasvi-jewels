import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-champagne bg-mist">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <BrandLogo href="/" size="lg" />
          <p className="mt-6 max-w-md text-sm leading-7 text-charcoal/80">
            {BRAND.tagline} Hand-finished fashion jewellery from Keshavnagar, Mundhwa —
            made for daily wear, weddings, festivals and the quiet moments in between.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Explore</p>
          <ul className="mt-4 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Visit & reach</p>
          <ul className="mt-4 space-y-3 text-sm text-charcoal/85">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-gold" /> {BRAND.location}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-gold" />
              <a href={`tel:${BRAND.phoneHref}`}>{BRAND.phone}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-gold" />
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </li>
            <li className="flex gap-2">
              <Instagram className="mt-0.5 h-4 w-4 text-gold" />
              <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer">
                @{BRAND.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-champagne/80 py-5 text-center text-xs tracking-wide text-charcoal/60">
        © {new Date().getFullYear()} {BRAND.name} by {BRAND.founder}. Affordable luxury jewellery, Pune.
      </div>
    </footer>
  );
}
