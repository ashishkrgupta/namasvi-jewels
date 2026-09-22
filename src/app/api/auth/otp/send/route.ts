import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { otpCode } from "@/lib/utils";
import { handleError } from "@/lib/api";

const schema = z.object({ phone: z.string().min(10) });

export async function POST(req: NextRequest) {
  try {
    const { phone } = schema.parse(await req.json());
    const code = otpCode();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      await prisma.user.update({
        where: { phone },
        data: { otpCode: code, otpExpires },
      });
    } else {
      await prisma.user.create({
        data: {
          name: "Namasvi Guest",
          phone,
          otpCode: code,
          otpExpires,
        },
      });
    }
    const demo = process.env.DEMO_MODE === "true";
    return NextResponse.json({
      ok: true,
      demoCode: demo ? code : undefined,
    });
  } catch (e) {
    return handleError(e);
  }
}
