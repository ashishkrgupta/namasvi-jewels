import { NextRequest, NextResponse } from "next/server";
import { recommendProducts } from "@/lib/catalog";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId") || undefined;
  const session = await getSession();
  const products = await recommendProducts({ productId, userId: session?.id });
  return NextResponse.json({ products });
}
