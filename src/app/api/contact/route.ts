import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const data = z
      .object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(8),
      })
      .parse(await req.json());
    await prisma.contactMessage.create({ data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
