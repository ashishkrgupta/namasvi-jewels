import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized() {
  return jsonError("Please sign in to continue.", 401);
}

export function forbidden() {
  return jsonError("You do not have permission to do that.", 403);
}

export async function parseJson<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>,
) {
  const body = await req.json();
  return schema.parse(body);
}

export function handleError(error: unknown) {
  if (error instanceof z.ZodError) {
    return jsonError(error.issues[0]?.message || "Invalid request.");
  }
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return forbidden();
  }
  console.error(error);
  return jsonError("Something went wrong. Please try again.", 500);
}
