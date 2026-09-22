"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { useAuth } from "@/providers/AuthProvider";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

export function Header({ announcement }: { announcement?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, setOpen } = useCart();
  const { items } = useWishlist();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {announcement && (
        <p className="bg-ink px-4 py-2 text-center text-[11px] tracking-[0.18em] text-champagne uppercase">
          {announcement}
        </p>
      )}
      <div
        className={cn(
          "border-b border-champagne/60 bg-ivory/90 backdrop-blur-md transition-shadow",
          scrolled && "shadow-soft",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <button
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <BrandLogo />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[12px] tracking-[0.18em] uppercase transition hover:text-gold",
                  pathname === link.href ? "text-gold" : "text-charcoal",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden sm:block"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] text-ink">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              aria-label="Open cart"
              className="relative"
              onClick={() => setOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] text-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            className="mx-auto flex max-w-3xl items-center gap-3 px-4 pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) router.push(`/shop?q=${encodeURIComponent(query)}`);
            }}
          >
            <Search className="h-4 w-4 text-gold" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try “earrings for a wedding under ₹1000”'
              className="w-full border-b border-champagne bg-transparent py-2 text-sm outline-none"
            />
          </form>
        )}
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setMenu(false)}>
          <aside
            className="h-full w-[82%] max-w-sm bg-ivory p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <BrandLogo href="/" size="sm" />
              <button aria-label="Close menu" onClick={() => setMenu(false)}>
                <X />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-[0.18em] uppercase"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="text-sm tracking-[0.18em] uppercase">
                Contact
              </Link>
              <p className="pt-6 text-xs text-charcoal/70">
                {user ? `Hello, ${user.name.split(" ")[0]}` : BRAND.tagline}
              </p>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
