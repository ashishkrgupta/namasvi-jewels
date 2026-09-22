import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StoreShell } from "@/components/layout/StoreShell";
import { formatINR } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";
import { AccountActions } from "./actions";

export const metadata = createMetadata({
  title: "Your account",
  description: "Manage orders, addresses and profile at Namasvi Jewels.",
  path: "/account",
});

export default async function AccountPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.address.findMany({ where: { userId: user.id } }),
  ]);

  return (
    <StoreShell>
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">Account</p>
        <h1 className="mt-2 font-serif text-4xl">Hello, {user.name.split(" ")[0]}</h1>
        <AccountActions email={user.email} phone={user.phone} name={user.name} isAdmin={user.role === "ADMIN"} />

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Order history</h2>
          <div className="mt-4 space-y-3">
            {orders.length === 0 && <p className="text-sm text-charcoal/70">No orders yet.</p>}
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/order/${o.orderNumber}`}
                className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-soft"
              >
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-charcoal/60">
                    {o.status} · {o.paymentStatus}
                  </p>
                </div>
                <p>{formatINR(o.total)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Saved addresses</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {addresses.map((a) => (
              <article key={a.id} className="rounded-3xl bg-white p-5 text-sm shadow-soft">
                <p className="text-xs tracking-widest text-gold uppercase">{a.label}</p>
                <p className="mt-2 font-medium">{a.name}</p>
                <p className="mt-1 leading-6">
                  {a.line1}, {a.city} {a.pincode}
                </p>
              </article>
            ))}
            {addresses.length === 0 && (
              <p className="text-sm text-charcoal/70">Addresses you use at checkout will appear here.</p>
            )}
          </div>
        </section>
      </div>
    </StoreShell>
  );
}
