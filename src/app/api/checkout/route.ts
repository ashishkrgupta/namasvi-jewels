import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { quoteCart } from "@/lib/cart";
import { getSession } from "@/lib/auth";
import { handleError, jsonError } from "@/lib/api";
import { orderNumber } from "@/lib/utils";

const lineSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = z
      .object({
        items: z.array(lineSchema).min(1),
        couponCode: z.string().optional(),
        paymentMethod: z.string(),
        email: z.string().email(),
        phone: z.string().min(10),
        guestName: z.string().min(2),
        shippingName: z.string(),
        shippingPhone: z.string(),
        shippingLine1: z.string(),
        shippingLine2: z.string().optional(),
        shippingCity: z.string(),
        shippingState: z.string(),
        shippingPincode: z.string(),
      })
      .parse(await req.json());

    const quote = await quoteCart(body.items, body.couponCode);
    if (!quote.items.length) return jsonError("Your bag is empty.");
    const user = await getSession();

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber(),
        userId: user?.id,
        email: body.email,
        phone: body.phone,
        guestName: body.guestName,
        status: "PROCESSING",
        paymentStatus: "PAID",
        paymentMethod: body.paymentMethod,
        subtotal: quote.subtotal,
        discount: quote.discount,
        shippingFee: quote.shipping,
        total: quote.total,
        couponCode: quote.coupon?.code,
        shippingName: body.shippingName,
        shippingPhone: body.shippingPhone,
        shippingLine1: body.shippingLine1,
        shippingLine2: body.shippingLine2,
        shippingCity: body.shippingCity,
        shippingState: body.shippingState,
        shippingPincode: body.shippingPincode,
        items: {
          create: quote.items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            price: item.unit,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
    });

    if (quote.coupon) {
      await prisma.coupon.update({
        where: { id: quote.coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    for (const item of quote.items) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await prisma.analyticsEvent.create({
      data: { type: "purchase", path: "/checkout", metadata: { total: quote.total } },
    });

    if (user) {
      await prisma.address.create({
        data: {
          userId: user.id,
          name: body.shippingName,
          phone: body.shippingPhone,
          line1: body.shippingLine1,
          line2: body.shippingLine2,
          city: body.shippingCity,
          state: body.shippingState,
          pincode: body.shippingPincode,
        },
      });
    }

    return NextResponse.json({ order });
  } catch (e) {
    return handleError(e);
  }
}
