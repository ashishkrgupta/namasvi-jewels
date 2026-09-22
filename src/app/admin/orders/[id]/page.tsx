import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderDetail } from "../detail";

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();
  return <OrderDetail order={order} />;
}
