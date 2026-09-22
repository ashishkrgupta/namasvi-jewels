"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShellClient";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

const METHODS = ["UPI", "Razorpay", "Credit Card", "Debit Card", "Net Banking", "Wallet"];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ discount: number; shipping: number; total: number; code?: string } | null>(null);
  const [pincode, setPincode] = useState("411036");
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const fallbackShip = subtotal >= BRAND.freeShippingFrom || !subtotal ? 0 : 79;
  const totals = applied ?? { discount: 0, shipping: fallbackShip, total: subtotal + fallbackShip };

  const formDefaults = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }),
    [user],
  );

  async function applyCoupon() {
    const res = await fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        couponCode: coupon,
      }),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error || "Coupon could not be applied");
    setApplied({
      discount: data.discount,
      shipping: data.shipping,
      total: data.total,
      code: data.coupon?.code,
    });
    toast(data.coupon ? "Coupon applied" : "Totals updated");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length) return toast("Your bag is empty");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      couponCode: applied?.code || coupon || undefined,
      paymentMethod: method,
      email: fd.get("email"),
      phone: fd.get("phone"),
      guestName: fd.get("name"),
      shippingName: fd.get("name"),
      shippingPhone: fd.get("phone"),
      shippingLine1: fd.get("line1"),
      shippingLine2: fd.get("line2"),
      shippingCity: fd.get("city"),
      shippingState: fd.get("state"),
      shippingPincode: fd.get("pincode"),
    };
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast(data.error || "Checkout failed");
    clear();
    router.push(`/order/${data.order.orderNumber}`);
  }

  return (
    <StoreShell>
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">Guest checkout welcome</p>
        <h1 className="mt-2 font-serif text-4xl">Checkout</h1>
        <form onSubmit={onSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="font-serif text-2xl">Contact & delivery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" required defaultValue={formDefaults.name} placeholder="Full name" className="rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <input name="phone" required defaultValue={formDefaults.phone || ""} placeholder="Phone" className="rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <input name="email" type="email" required defaultValue={formDefaults.email || ""} placeholder="Email" className="sm:col-span-2 rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <input name="line1" required placeholder="Address line 1" className="sm:col-span-2 rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <input name="line2" placeholder="Landmark (optional)" className="sm:col-span-2 rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <input name="city" required defaultValue="Pune" placeholder="City" className="rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <input name="state" required defaultValue="Maharashtra" placeholder="State" className="rounded-2xl border border-champagne px-4 py-3 text-sm" />
              <input
                name="pincode"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                className="rounded-2xl border border-champagne px-4 py-3 text-sm"
              />
            </div>
            <p className="text-xs text-charcoal/60">
              Estimated delivery to {pincode || "your pincode"}: 3–6 business days from Pune.
            </p>
            <div>
              <h3 className="font-serif text-xl">Payment</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {METHODS.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`rounded-full px-3 py-2 text-xs ${
                      method === m ? "bg-ink text-ivory" : "bg-mist"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-3">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 rounded-full border border-champagne px-4 py-2 text-sm"
              />
              <Button type="button" size="sm" variant="line" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Discount</span>
                <span>-{formatINR(totals.discount)}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping</span>
                <span>{totals.shipping ? formatINR(totals.shipping) : "Complimentary"}</span>
              </p>
              <p className="flex justify-between pt-2 font-medium">
                <span>Total</span>
                <span>{formatINR(totals.total)}</span>
              </p>
            </div>
            <Button type="submit" className="mt-6 w-full" disabled={loading || !items.length}>
              {loading ? "Placing order…" : `Pay ${formatINR(totals.total)}`}
            </Button>
            <p className="mt-3 text-center text-[11px] text-charcoal/55">
              Secure checkout · UPI, cards, net banking & wallets
            </p>
          </aside>
        </form>
      </div>
    </StoreShell>
  );
}
