import Link from "next/link";
import { StoreShell } from "@/components/layout/StoreShell";

export default function NotFound() {
  return (
    <StoreShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">404</p>
        <h1 className="mt-3 font-serif text-5xl">This piece has wandered off</h1>
        <p className="mt-4 text-charcoal/70">Let’s take you back to the collection.</p>
        <Link href="/shop" className="mt-8 inline-block text-sm tracking-[0.2em] text-gold uppercase">
          Shop jewellery
        </Link>
      </div>
    </StoreShell>
  );
}
