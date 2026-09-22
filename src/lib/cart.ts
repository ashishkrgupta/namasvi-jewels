import { prisma } from "./prisma";
import { effectivePrice } from "./utils";

export type CartLine = {
  productId: string;
  quantity: number;
};

export function shippingFee(subtotal: number) {
  return subtotal >= 999 ? 0 : 79;
}

export async function quoteCart(lines: CartLine[], couponCode?: string) {
  const ids = lines.map((l) => l.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  const items = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      const unit = effectivePrice(product.price, product.salePrice);
      return {
        product,
        quantity: line.quantity,
        unit,
        lineTotal: unit * line.quantity,
        image: product.images[0]?.url || "",
      };
    })
    .filter(Boolean) as {
    product: (typeof products)[number];
    quantity: number;
    unit: number;
    lineTotal: number;
    image: string;
  }[];

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  let discount = 0;
  let coupon = null as Awaited<ReturnType<typeof prisma.coupon.findUnique>>;

  if (couponCode) {
    coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });
    const valid =
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
      subtotal >= coupon.minOrder;

    if (valid && coupon) {
      discount =
        coupon.type === "PERCENTAGE"
          ? Math.round((subtotal * coupon.value) / 100)
          : coupon.value;
      discount = Math.min(discount, subtotal);
    } else {
      coupon = null;
    }
  }

  const shipping = shippingFee(Math.max(0, subtotal - discount));
  const total = Math.max(0, subtotal - discount + shipping);

  return { items, subtotal, discount, shipping, total, coupon };
}
