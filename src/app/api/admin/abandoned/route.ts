import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const abandoned = await prisma.cartItem.findMany({
      where: { updatedAt: { lt: new Date(Date.now() - 1000 * 60 * 30) } },
      include: { user: true, product: true },
      take: 50,
    });
    return NextResponse.json({ abandoned });
  } catch (e) {
    return handleError(e);
  }
}
