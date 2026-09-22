"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { COLORS, MATERIALS, OCCASIONS } from "@/lib/constants";

export function ProductFilters({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/shop?${next.toString()}`);
  }

  const selectClass =
    "w-full rounded-full border border-champagne bg-white px-4 py-2.5 text-sm";

  return (
    <aside className="space-y-4 rounded-[2rem] bg-white p-5 shadow-soft lg:sticky lg:top-28">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">Filter</p>
      <select
        className={selectClass}
        value={params.get("category") || ""}
        onChange={(e) => set("category", e.target.value)}
        aria-label="Category"
      >
        <option value="">Category</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={params.get("occasion") || ""}
        onChange={(e) => set("occasion", e.target.value)}
        aria-label="Occasion"
      >
        <option value="">Occasion</option>
        {OCCASIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={params.get("color") || ""}
        onChange={(e) => set("color", e.target.value)}
        aria-label="Color"
      >
        <option value="">Color</option>
        {COLORS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={params.get("material") || ""}
        onChange={(e) => set("material", e.target.value)}
        aria-label="Material"
      >
        <option value="">Material</option>
        {MATERIALS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min ₹"
          className={selectClass}
          defaultValue={params.get("minPrice") || ""}
          onBlur={(e) => set("minPrice", e.target.value)}
          aria-label="Minimum price"
        />
        <input
          type="number"
          placeholder="Max ₹"
          className={selectClass}
          defaultValue={params.get("maxPrice") || ""}
          onBlur={(e) => set("maxPrice", e.target.value)}
          aria-label="Maximum price"
        />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          ["trending", "Trending"],
          ["newArrival", "New Arrival"],
          ["bestSeller", "Best Seller"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => set(key, params.get(key) ? "" : "1")}
            className={`rounded-full px-3 py-1.5 ${
              params.get(key) ? "bg-ink text-ivory" : "bg-mist"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <select
        className={selectClass}
        value={params.get("sort") || "popularity"}
        onChange={(e) => set("sort", e.target.value)}
        aria-label="Sort by"
      >
        <option value="popularity">Popularity</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </aside>
  );
}
