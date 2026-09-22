import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ coupons });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = z
      .object({
        code: z.string().min(3),
        type: z.enum(["PERCENTAGE", "FIXED", "FESTIVAL", "REFERRAL"]),
        value: z.number(),
        minOrder: z.number().optional(),
        usageLimit: z.number().optional(),
      })
      .parse(await req.json());
    const coupon = await prisma.coupon.create({
      data: { ...data, code: data.code.toUpperCase() },
    });
    return NextResponse.json({ coupon });
  } catch (e) {
    return handleError(e);
  }
}
