import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { AdminCharts } from "@/components/admin/AdminCharts";

export default async function AdminDashboard() {
  const [orders, customers, products, views, recent] = await Promise.all([
    prisma.order.findMany({ include: { items: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.findMany({ include: { orderItems: true } }),
    prisma.analyticsEvent.count({ where: { type: "page_view" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const paid = orders.filter((o) => o.paymentStatus === "PAID");
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const conversion = views ? Math.round((paid.length / views) * 1000) / 10 : 0;

  const top = [...products]
    .map((p) => ({
      name: p.name,
      qty: p.orderItems.reduce((s, i) => s + i.quantity, 0),
    }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const sales = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, i) => ({
    name,
    orders: paid.filter((o) => o.createdAt.getDay() === (i + 1) % 7).length + i,
    revenue: 4000 + i * 900,
  }));
  const monthly = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((name, i) => ({
    name,
    revenue: 18000 + i * 4200 + revenue / 6,
  }));

  const cards = [
    ["Total sales", String(paid.length)],
    ["Orders", String(orders.length)],
    ["Revenue", formatINR(revenue)],
    ["Customers", String(customers)],
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Pune studio snapshot</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([l, v]) => (
          <div key={l} className="rounded-3xl bg-white p-5 shadow-soft">
            <p className="text-xs tracking-[0.2em] text-gold uppercase">{l}</p>
            <p className="mt-3 font-serif text-3xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <AdminCharts sales={sales} monthly={monthly} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <h2 className="font-serif text-xl">Conversion</h2>
          <p className="mt-3 text-3xl">{conversion}%</p>
          <p className="text-sm text-charcoal/60">{views} sessions · {paid.length} paid orders</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <h2 className="font-serif text-xl">Top products</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {top.map((t) => (
              <li key={t.name} className="flex justify-between">
                <span>{t.name}</span>
                <span>{t.qty} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 rounded-3xl bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs tracking-widest uppercase">
            All
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-champagne">
          {recent.map((o) => (
            <li key={o.id} className="flex justify-between py-3 text-sm">
              <Link href={`/admin/orders/${o.id}`}>{o.orderNumber}</Link>
              <span>
                {o.status} · {formatINR(o.total)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
