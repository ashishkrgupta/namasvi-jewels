import { prisma } from "@/lib/prisma";
import { AdminCharts } from "@/components/admin/AdminCharts";

export default async function AnalyticsPage() {
  const [views, addToCart, purchases, products] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: "page_view" } }),
    prisma.analyticsEvent.count({ where: { type: "add_to_cart" } }),
    prisma.analyticsEvent.count({ where: { type: "purchase" } }),
    prisma.product.findMany({ include: { orderItems: true }, take: 8 }),
  ]);
  const abandonment = addToCart ? Math.round(((addToCart - purchases) / Math.max(addToCart, 1)) * 100) : 0;
  const conversion = views ? Math.round((purchases / views) * 1000) / 10 : 0;

  const sales = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, i) => ({
    name,
    orders: 2 + i,
    revenue: 3000 + i * 800,
  }));
  const monthly = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((name, i) => ({
    name,
    revenue: 12000 + i * 3500,
  }));

  return (
    <div>
      <h1 className="font-serif text-4xl">Analytics</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Traffic", String(views)],
          ["Add to cart", String(addToCart)],
          ["Conversion", `${conversion}%`],
          ["Cart abandonment", `${abandonment}%`],
        ].map(([l, v]) => (
          <div key={l} className="rounded-3xl bg-white p-5 shadow-soft">
            <p className="text-xs tracking-widest text-gold uppercase">{l}</p>
            <p className="mt-2 font-serif text-3xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <AdminCharts sales={sales} monthly={monthly} />
      </div>
      <div className="mt-8 rounded-3xl bg-white p-5 shadow-soft">
        <h2 className="font-serif text-xl">Product performance</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {products.map((p) => (
            <li key={p.id} className="flex justify-between">
              <span>{p.name}</span>
              <span>{p.orderItems.reduce((s, i) => s + i.quantity, 0)} sold · stock {p.stock}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
