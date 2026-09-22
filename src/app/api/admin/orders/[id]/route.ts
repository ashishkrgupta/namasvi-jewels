import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";
import type { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status as OrderStatus | undefined,
        trackingId: body.trackingId,
        paymentStatus: body.paymentStatus,
      },
    });
    return NextResponse.json({ order });
  } catch (e) {
    return handleError(e);
  }
}
