import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (body.announcement) {
      await prisma.announcement.updateMany({ data: { active: false } });
      await prisma.announcement.create({ data: { message: body.announcement, active: true } });
    }
    if (body.about) {
      await prisma.siteContent.upsert({
        where: { key: "about" },
        update: { value: body.about },
        create: { key: "about", value: body.about },
      });
    }
    if (body.banner) {
      await prisma.banner.updateMany({ data: { active: false } });
      await prisma.banner.create({
        data: { ...body.banner, active: true },
      });
    }
    if (body.promo) {
      await prisma.siteContent.upsert({
        where: { key: "promo" },
        update: { value: body.promo },
        create: { key: "promo", value: body.promo },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
