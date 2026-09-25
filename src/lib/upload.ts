import { prisma } from "@/lib/prisma";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export class UploadError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

function mimeFromName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "avif") return "image/avif";
  return "";
}

export function storedImageUrl(id: string) {
  return `/api/images/${id}`;
}

export async function uploadProductImage(file: File) {
  const mime = ALLOWED.has(file.type) ? file.type : mimeFromName(file.name);
  if (!ALLOWED.has(mime)) {
    throw new UploadError("Please upload a JPEG, PNG, WebP, GIF or AVIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Each image must be 5MB or smaller.");
  }

  const stored = await prisma.storedImage.create({
    data: {
      data: Buffer.from(await file.arrayBuffer()),
      mimeType: mime,
    },
  });
  return storedImageUrl(stored.id);
}
