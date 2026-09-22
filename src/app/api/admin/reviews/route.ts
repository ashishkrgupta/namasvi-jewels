import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";
import type { ReviewStatus } from "@prisma/client";

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const review = await prisma.review.update({
      where: { id: body.id },
      data: { status: body.status as ReviewStatus },
    });
    return NextResponse.json({ review });
  } catch (e) {
    return handleError(e);
  }
}
