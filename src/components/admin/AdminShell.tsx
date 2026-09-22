"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Gift,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Package,
  ShoppingBag,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Gift },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-mist text-charcoal">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-champagne bg-ivory p-6 lg:block">
        <BrandLogo href="/admin" size="sm" />
        <p className="mt-3 text-[10px] tracking-[0.3em] text-gold uppercase">Studio admin</p>
        <nav className="mt-10 space-y-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm",
                pathname === l.href ? "bg-ink text-ivory" : "hover:bg-mist",
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="mt-10 flex items-center gap-2 text-sm text-charcoal/70"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="flex items-center justify-between border-b border-champagne bg-ivory px-4 py-4 lg:px-8">
          <p className="font-serif text-xl lg:hidden">Namasvi Admin</p>
          <Link href="/" className="ml-auto text-xs tracking-widest uppercase">
            View store
          </Link>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
