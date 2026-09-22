"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";

export function ReviewManager({
  reviews,
}: {
  reviews: {
    id: string;
    title: string;
    rating: number;
    status: string;
    product: { name: string };
    user: { name: string };
  }[];
}) {
  const router = useRouter();
  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    toast(`Review ${status.toLowerCase()}`);
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl">Reviews</h1>
      <div className="mt-6 space-y-3">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-3xl bg-white p-5 shadow-soft">
            <p className="text-gold">{"★".repeat(r.rating)}</p>
            <p className="font-serif text-xl">{r.title}</p>
            <p className="text-sm text-charcoal/70">
              {r.user.name} on {r.product.name} · {r.status}
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => setStatus(r.id, "APPROVED")}>
                Approve
              </Button>
              <Button size="sm" variant="line" onClick={() => setStatus(r.id, "REJECTED")}>
                Reject
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
