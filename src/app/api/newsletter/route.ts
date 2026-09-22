import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(await req.json());
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
