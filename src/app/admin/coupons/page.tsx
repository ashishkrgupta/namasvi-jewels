import { prisma } from "@/lib/prisma";
import { CouponManager } from "./ui";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return <CouponManager coupons={coupons} />;
}
