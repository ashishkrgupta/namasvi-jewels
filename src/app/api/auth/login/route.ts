import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, signToken, verifyPassword } from "@/lib/auth";
import { handleError, jsonError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = loginSchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return jsonError("Invalid email or password.", 401);
    }
    const token = await signToken({ userId: user.id, role: user.role });
    await setAuthCookie(token);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    return handleError(e);
  }
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export async function PUT(req: NextRequest) {
  try {
    const data = registerSchema.parse(await req.json());
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
