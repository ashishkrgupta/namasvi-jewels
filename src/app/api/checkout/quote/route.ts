import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { quoteCart } from "@/lib/cart";
import { handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = z
      .object({
        items: z.array(
          z.object({ productId: z.string(), quantity: z.number().int().min(1) }),
        ),
        couponCode: z.string().optional(),
      })
      .parse(await req.json());
    const quote = await quoteCart(body.items, body.couponCode);
    return NextResponse.json({
      subtotal: quote.subtotal,
      discount: quote.discount,
      shipping: quote.shipping,
      total: quote.total,
      coupon: quote.coupon,
    });
  } catch (e) {
    return handleError(e);
  }
}
