import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signToken } from "@/lib/auth";
import { handleError, jsonError } from "@/lib/api";

const schema = z.object({
  phone: z.string().min(10),
  code: z.string().length(6),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { phone, code, name } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user?.otpCode || user.otpCode !== code || !user.otpExpires || user.otpExpires < new Date()) {
      return jsonError("Invalid or expired OTP.", 401);
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpires: null,
        name: name || user.name,
      },
    });
    const token = await signToken({ userId: updated.id, role: updated.role });
    await setAuthCookie(token);
    return NextResponse.json({
      user: { id: updated.id, name: updated.name, phone: updated.phone, role: updated.role },
    });
  } catch (e) {
    return handleError(e);
  }
}
