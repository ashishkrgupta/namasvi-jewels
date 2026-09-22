import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import { PrintButton } from "../label/print";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-2xl bg-white p-10">
      <p className="font-serif text-3xl">{BRAND.name}</p>
      <p className="text-xs tracking-[0.3em] text-gold uppercase">Tax invoice</p>
      <h1 className="mt-6 text-xl">{order.orderNumber}</h1>
      <p className="mt-2 text-sm">
        Billed to {order.shippingName}
        <br />
        {order.shippingLine1}, {order.shippingCity} {order.shippingPincode}
      </p>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.quantity}</td>
              <td>{formatINR(i.price * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-right font-medium">Grand total {formatINR(order.total)}</p>
      <PrintButton />
    </div>
  );
}
