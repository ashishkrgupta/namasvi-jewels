import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  await prisma.analyticsEvent.create({
    data: {
      type: body.type || "page_view",
      path: body.path,
      productId: body.productId,
      metadata: body.metadata,
    },
  });
  return NextResponse.json({ ok: true });
}
