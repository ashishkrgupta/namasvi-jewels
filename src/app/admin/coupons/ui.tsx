"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { formatINR } from "@/lib/utils";

export function CouponManager({
  coupons,
}: {
  coupons: {
    id: string;
    code: string;
    type: string;
    value: number;
    usedCount: number;
    minOrder: number;
    active: boolean;
  }[];
}) {
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: fd.get("code"),
        type: fd.get("type"),
        value: Number(fd.get("value")),
        minOrder: Number(fd.get("minOrder") || 0),
        usageLimit: fd.get("usageLimit") ? Number(fd.get("usageLimit")) : undefined,
      }),
    });
    if (!res.ok) return toast("Could not create coupon");
    toast("Coupon created");
    router.refresh();
    e.currentTarget.reset();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl">Coupons</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-3xl bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-5">
        <input name="code" required placeholder="CODE" className="rounded-2xl border border-champagne px-3 py-2 text-sm" />
        <select name="type" className="rounded-2xl border border-champagne px-3 py-2 text-sm">
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED">Fixed</option>
          <option value="FESTIVAL">Festival</option>
          <option value="REFERRAL">Referral</option>
        </select>
        <input name="value" type="number" required placeholder="Value" className="rounded-2xl border border-champagne px-3 py-2 text-sm" />
        <input name="minOrder" type="number" placeholder="Min order" className="rounded-2xl border border-champagne px-3 py-2 text-sm" />
        <Button type="submit">Create</Button>
      </form>
      <ul className="mt-6 space-y-2">
        {coupons.map((c) => (
          <li key={c.id} className="flex justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-soft">
            <span>
              {c.code} · {c.type} · {c.type === "PERCENTAGE" ? `${c.value}%` : formatINR(c.value)}
            </span>
            <span>
              used {c.usedCount} · min {formatINR(c.minOrder)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
