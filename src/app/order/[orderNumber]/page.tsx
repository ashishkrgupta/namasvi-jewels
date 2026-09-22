import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoreShell } from "@/components/layout/StoreShell";
import { formatINR } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Order confirmation",
  description: "Your Namasvi Jewels order.",
  path: "/order",
});

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">Thank you</p>
        <h1 className="mt-2 font-serif text-4xl">Order {order.orderNumber}</h1>
        <p className="mt-3 text-sm text-charcoal/70">
          Status: {order.status} · Payment: {order.paymentStatus} via {order.paymentMethod}
        </p>
        <ul className="mt-8 divide-y divide-champagne rounded-3xl bg-white px-5 shadow-soft">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-4 text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatINR(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-right font-serif text-2xl">Total {formatINR(order.total)}</p>
        <p className="mt-4 text-sm leading-7 text-charcoal/75">
          Delivering to {order.shippingName}, {order.shippingLine1}, {order.shippingCity}{" "}
          {order.shippingPincode}.
          {order.trackingId ? ` Tracking: ${order.trackingId}` : ""}
        </p>
      </div>
    </StoreShell>
  );
}
