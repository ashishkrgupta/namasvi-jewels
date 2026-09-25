import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { WHATSAPP_SAMPLE } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = z
      .object({
        message: z.string().min(4).optional(),
        page: z.string().optional(),
      })
      .parse(await req.json().catch(() => ({})));
    const session = await getSession();
    const message = [body.message || WHATSAPP_SAMPLE, body.page ? `Page: ${body.page}` : ""]
      .filter(Boolean)
      .join("\n");

    await prisma.contactMessage.create({
      data: {
        name: session?.name || "WhatsApp visitor",
        email: session?.email || "whatsapp@namasvi.jewels",
        phone: session?.phone,
        message,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
