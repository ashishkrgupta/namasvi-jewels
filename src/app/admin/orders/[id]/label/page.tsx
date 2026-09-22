import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BRAND } from "@/lib/constants";
import { PrintButton } from "./print";

export default async function LabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-gold bg-white p-8">
      <p className="text-xs tracking-[0.3em] text-gold uppercase">Shipping label</p>
      <p className="mt-4 font-serif text-2xl">{order.shippingName}</p>
      <p className="mt-2 text-sm leading-6">
        {order.shippingLine1}
        <br />
        {order.shippingCity}, {order.shippingState} {order.shippingPincode}
        <br />
        {order.shippingPhone}
      </p>
      <p className="mt-6 text-xs">From: {BRAND.name}, {BRAND.location}</p>
      <p className="mt-2 text-xs">Order {order.orderNumber}</p>
      {order.trackingId && <p className="mt-2 text-sm">AWB {order.trackingId}</p>}
      <PrintButton />
    </div>
  );
}
