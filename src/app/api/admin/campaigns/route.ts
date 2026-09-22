import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = z
      .object({
        type: z.enum(["EMAIL", "WHATSAPP"]),
        subject: z.string(),
        body: z.string(),
        segment: z.string().default("all"),
      })
      .parse(await req.json());

    const where =
      data.segment === "repeat"
        ? { orders: { some: {} } }
        : data.segment === "new"
          ? { orders: { none: {} }, role: "CUSTOMER" as const }
          : { role: "CUSTOMER" as const };

    const recipients = await prisma.user.count({ where });
    const campaign = await prisma.campaign.create({
      data: {
        ...data,
        status: "SENT",
        recipients,
        sentAt: new Date(),
      },
    });
    return NextResponse.json({ campaign });
  } catch (e) {
    return handleError(e);
  }
}
