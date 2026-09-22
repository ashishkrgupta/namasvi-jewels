import { prisma } from "@/lib/prisma";
import { ReviewManager } from "./ui";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  return <ReviewManager reviews={reviews} />;
}
