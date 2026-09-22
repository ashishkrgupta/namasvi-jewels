import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="text-xs tracking-widest text-gold uppercase">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-champagne">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-gold">
                    {o.orderNumber}
                  </Link>
                </td>
                <td>{o.guestName || o.email}</td>
                <td>
                  {o.status} · {o.paymentStatus}
                </td>
                <td>{formatINR(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
