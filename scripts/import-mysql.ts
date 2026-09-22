import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

type Dump = Record<string, Record<string, unknown>[]>;

const prisma = new PrismaClient();

async function insert(name: string, rows: Record<string, unknown>[], fn: (row: Record<string, unknown>) => Promise<unknown>) {
  if (!rows?.length) {
    console.log(name, 0);
    return;
  }
  for (const row of rows) {
    await fn(row);
  }
  console.log(name, rows.length);
}

async function main() {
  const dump = JSON.parse(readFileSync("/tmp/namasvi-pg-dump.json", "utf8")) as Dump;
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=0");

  await insert("users", dump.users, (d) => prisma.user.create({ data: d as never }));
  await insert("addresses", dump.addresses, (d) => prisma.address.create({ data: d as never }));
  await insert("categories", dump.categories, (d) => prisma.category.create({ data: d as never }));
  await insert("collections", dump.collections, (d) => prisma.collection.create({ data: d as never }));
  await insert("products", dump.products, (d) => prisma.product.create({ data: d as never }));
  await insert("productImages", dump.productImages, (d) => prisma.productImage.create({ data: d as never }));
  await insert("productVideos", dump.productVideos, (d) => prisma.productVideo.create({ data: d as never }));
  await insert("reviews", dump.reviews, (d) => prisma.review.create({ data: d as never }));
  await insert("cartItems", dump.cartItems, (d) => prisma.cartItem.create({ data: d as never }));
  await insert("wishlistItems", dump.wishlistItems, (d) => prisma.wishlistItem.create({ data: d as never }));
  await insert("coupons", dump.coupons, (d) => prisma.coupon.create({ data: d as never }));
  await insert("banners", dump.banners, (d) => prisma.banner.create({ data: d as never }));
  await insert("siteContent", dump.siteContent, (d) => prisma.siteContent.create({ data: d as never }));
  await insert("announcements", dump.announcements, (d) => prisma.announcement.create({ data: d as never }));
  await insert("newsletterSubscribers", dump.newsletterSubscribers, (d) =>
    prisma.newsletterSubscriber.create({ data: d as never }),
  );
  await insert("contactMessages", dump.contactMessages, (d) => prisma.contactMessage.create({ data: d as never }));
  await insert("campaigns", dump.campaigns, (d) => prisma.campaign.create({ data: d as never }));
  await insert("orders", dump.orders, (d) => prisma.order.create({ data: d as never }));
  await insert("orderItems", dump.orderItems, (d) => prisma.orderItem.create({ data: d as never }));
  await insert("analyticsEvents", dump.analyticsEvents, (d) => prisma.analyticsEvent.create({ data: d as never }));

  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=1");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
