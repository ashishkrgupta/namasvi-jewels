import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl">Customers</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="text-xs tracking-widest text-gold uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th>Contact</th>
              <th>Orders</th>
              <th>Lifetime value</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const ltv = c.orders
                .filter((o) => o.paymentStatus === "PAID")
                .reduce((s, o) => s + o.total, 0);
              return (
                <tr key={c.id} className="border-t border-champagne">
                  <td className="px-4 py-3">{c.name}</td>
                  <td>
                    {c.email}
                    <br />
                    {c.phone}
                  </td>
                  <td>{c.orders.length}</td>
                  <td>{formatINR(ltv)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
