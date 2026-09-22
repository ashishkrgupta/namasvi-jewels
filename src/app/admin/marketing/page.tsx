import { prisma } from "@/lib/prisma";
import { MarketingTools } from "./ui";

export default async function MarketingPage() {
  const [campaigns, abandoned, all, withOrders] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.cartItem.findMany({
      include: { user: true, product: true },
      take: 12,
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "CUSTOMER", orders: { some: {} } } }),
  ]);

  return (
    <MarketingTools
      campaigns={campaigns}
      abandoned={abandoned}
      segments={[
        { key: "all", count: all },
        { key: "repeat", count: withOrders },
        { key: "new", count: all - withOrders },
      ]}
    />
  );
}
