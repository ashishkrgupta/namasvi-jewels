"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2, Upload } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  url: string;
  preview?: string;
  uploading?: boolean;
};

export function ImageUploader({
  value,
  onChange,
  onBusyChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>(() =>
    value.map((url) => ({ id: url, url })),
  );
  const [dragOver, setDragOver] = useState(false);

  function commit(next: Item[]) {
    setItems(next);
    onChange(next.filter((i) => i.url && !i.uploading).map((i) => i.url));
    onBusyChange?.(next.some((i) => i.uploading));
  }

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      toast("Please choose image files.");
      return;
    }

    const placeholders: Item[] = list.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      url: "",
      preview: URL.createObjectURL(file),
      uploading: true,
    }));
    const withPlaceholders = [...items, ...placeholders];
    commit(withPlaceholders);

    const form = new FormData();
    list.forEach((file) => form.append("files", file));

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      const urls: string[] = data.urls || (data.url ? [data.url] : []);
      const resolved = withPlaceholders.map((item) => {
        const idx = placeholders.findIndex((p) => p.id === item.id);
        if (idx === -1) return item;
        if (item.preview) URL.revokeObjectURL(item.preview);
        return { id: urls[idx] || item.id, url: urls[idx] || "", uploading: false };
      });
      commit(resolved.filter((i) => i.url));
      toast(urls.length === 1 ? "Image uploaded" : `${urls.length} images uploaded`);
    } catch (err) {
      placeholders.forEach((p) => p.preview && URL.revokeObjectURL(p.preview));
      commit(items);
      toast(err instanceof Error ? err.message : "Upload failed");
    }
  }

  function remove(id: string) {
    const target = items.find((i) => i.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    commit(items.filter((i) => i.id !== id));
  }

  function makeCover(id: string) {
    const next = [...items];
    const idx = next.findIndex((i) => i.id === id);
    if (idx <= 0) return;
    const [picked] = next.splice(idx, 1);
    next.unshift(picked);
    commit(next);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) void uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center transition",
          dragOver ? "border-gold bg-champagne/40" : "border-champagne bg-mist/50 hover:border-gold",
        )}
      >
        <Upload className="h-6 w-6 text-gold" />
        <p className="mt-3 text-sm">Drop product photos here, or click to browse</p>
        <p className="mt-1 text-xs text-charcoal/60">JPEG, PNG or WebP · up to 5MB each</p>
      </button>

      {items.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item, i) => (
            <li key={item.id} className="group relative overflow-hidden rounded-2xl bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.preview || item.url}
                alt=""
                className="aspect-square w-full object-cover"
              />
              {item.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                  <Loader2 className="h-6 w-6 animate-spin text-ivory" />
                </div>
              )}
              {!item.uploading && (
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-ink/55 p-1.5 opacity-0 transition group-hover:opacity-100">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(item.id)}
                      className="rounded-full bg-ivory/90 p-1.5"
                      title="Use as cover"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {i === 0 && (
                    <span className="rounded-full bg-gold px-2 py-1 text-[10px] tracking-widest text-ink uppercase">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="ml-auto rounded-full bg-ivory/90 p-1.5"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border border-dashed border-champagne text-charcoal/70 hover:border-gold"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="mt-2 text-[11px] tracking-widest uppercase">Add more</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
