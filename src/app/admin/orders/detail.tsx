"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export function OrderDetail({
  order,
}: {
  order: {
    id: string;
    orderNumber: string;
    email: string;
    phone: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    total: number;
    trackingId: string | null;
    shippingName: string;
    shippingLine1: string;
    shippingCity: string;
    shippingPincode: string;
    items: { id: string; name: string; quantity: number; price: number }[];
  };
}) {
  const router = useRouter();

  async function save(status: string, trackingId?: string) {
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingId }),
    });
    toast("Order updated");
    router.refresh();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">{order.orderNumber}</h1>
      <p className="mt-2 text-sm">
        {order.email} · {order.phone} · {order.paymentMethod}
      </p>
      <ul className="mt-6 rounded-3xl bg-white p-5 shadow-soft">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between py-2 text-sm">
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>{formatINR(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-serif text-2xl">Total {formatINR(order.total)}</p>
      <p className="mt-2 text-sm">
        Ship to {order.shippingName}, {order.shippingLine1}, {order.shippingCity}{" "}
        {order.shippingPincode}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button key={s} size="sm" variant={s === order.status ? "gold" : "line"} onClick={() => save(s)}>
            {s}
          </Button>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          save(order.status, String(fd.get("trackingId")));
        }}
      >
        <input
          name="trackingId"
          defaultValue={order.trackingId || ""}
          placeholder="Tracking ID"
          className="flex-1 rounded-full border border-champagne px-4 py-2 text-sm"
        />
        <Button type="submit" size="sm">
          Save tracking
        </Button>
      </form>
      <div className="mt-6 flex gap-4 text-sm">
        <Link href={`/admin/orders/${order.id}/invoice`} className="text-gold">
          Print invoice
        </Link>
        <Link href={`/admin/orders/${order.id}/label`} className="text-gold">
          Shipping label
        </Link>
      </div>
    </div>
  );
}
