import { NextRequest, NextResponse } from "next/server";
import { parseNaturalSearch } from "@/lib/ai";
import { searchByIntent } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const intent = parseNaturalSearch(q);
  const products = await searchByIntent(intent);
  return NextResponse.json({ intent, products });
}
