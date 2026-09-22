import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { handleError, jsonError } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return jsonError("An account with this email already exists.");
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        passwordHash: await hashPassword(data.password),
      },
    });
    const token = await signToken({ userId: user.id, role: user.role });
    await setAuthCookie(token);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    return handleError(e);
  }
}
