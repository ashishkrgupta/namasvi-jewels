"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Cat = { id: string; name: string };
type Col = { id: string; name: string };

export function ProductForm({
  categories,
  collections,
  product,
}: {
  categories: Cat[];
  collections: Col[];
  product?: {
    id: string;
    name: string;
    sku: string;
    description: string;
    material: string;
    occasion: string;
    color: string;
    price: number;
    salePrice: number | null;
    stock: number;
    weight: number | null;
    tags: unknown;
    categoryId: string;
    collectionId: string | null;
    images: { url: string }[];
    trending: boolean;
    newArrival: boolean;
    bestSeller: boolean;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images.map((i) => i.url) ?? []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) return toast("Please wait for images to finish uploading.");
    if (!images.length) return toast("Add at least one product photo.");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      sku: fd.get("sku"),
      description: fd.get("description"),
      material: fd.get("material"),
      occasion: fd.get("occasion"),
      color: fd.get("color"),
      price: Number(fd.get("price")),
      salePrice: fd.get("salePrice") ? Number(fd.get("salePrice")) : null,
      stock: Number(fd.get("stock")),
      weight: fd.get("weight") ? Number(fd.get("weight")) : undefined,
      tags: String(fd.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      categoryId: fd.get("categoryId"),
      collectionId: fd.get("collectionId") || undefined,
      images,
      trending: fd.get("trending") === "on",
      newArrival: fd.get("newArrival") === "on",
      bestSeller: fd.get("bestSeller") === "on",
    };
    const res = await fetch(
      product ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      return toast(data.error || "Could not save");
    }
    toast("Product saved");
    router.push("/admin/products");
    router.refresh();
  }

  const field = "w-full rounded-2xl border border-champagne px-4 py-3 text-sm";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-3 rounded-[2rem] bg-white p-6 shadow-soft">
      <h1 className="font-serif text-3xl">{product ? "Edit product" : "Add product"}</h1>
      <input name="name" required defaultValue={product?.name} placeholder="Product name" className={field} />
      <input name="sku" required defaultValue={product?.sku} placeholder="SKU" className={field} />
      <textarea name="description" required defaultValue={product?.description} placeholder="Description" rows={4} className={field} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="material" required defaultValue={product?.material} placeholder="Material" className={field} />
        <input name="occasion" required defaultValue={product?.occasion} placeholder="Occasion" className={field} />
        <input name="color" required defaultValue={product?.color} placeholder="Color" className={field} />
        <input name="weight" type="number" step="0.1" defaultValue={product?.weight ?? ""} placeholder="Weight (g)" className={field} />
        <input name="price" type="number" required defaultValue={product?.price} placeholder="Price" className={field} />
        <input name="salePrice" type="number" defaultValue={product?.salePrice ?? ""} placeholder="Sale price" className={field} />
        <input name="stock" type="number" required defaultValue={product?.stock ?? 10} placeholder="Stock" className={field} />
        <input
          name="tags"
          defaultValue={
            Array.isArray(product?.tags)
              ? product.tags.filter((t): t is string => typeof t === "string").join(", ")
              : ""
          }
          placeholder="Tags (comma)"
          className={field}
        />
      </div>
      <select name="categoryId" defaultValue={product?.categoryId} className={field} required>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select name="collectionId" defaultValue={product?.collectionId || ""} className={field}>
        <option value="">Collection (optional)</option>
        {collections.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div>
        <p className="mb-2 text-xs tracking-[0.18em] text-gold uppercase">Product photos</p>
        <ImageUploader value={images} onChange={setImages} onBusyChange={setUploading} />
      </div>
      <div className="flex gap-6 text-sm">
        <label>
          <input type="checkbox" name="trending" defaultChecked={product?.trending} /> Trending
        </label>
        <label>
          <input type="checkbox" name="newArrival" defaultChecked={product?.newArrival} /> New arrival
        </label>
        <label>
          <input type="checkbox" name="bestSeller" defaultChecked={product?.bestSeller} /> Best seller
        </label>
      </div>
      <Button type="submit" disabled={loading || uploading}>
        {loading ? "Saving…" : uploading ? "Uploading photos…" : "Save product"}
      </Button>
    </form>
  );
}
