import { createHash, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export class UploadError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function signCloudinary(params: Record<string, string | number>, secret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1")
    .update(`${toSign}${secret}`)
    .digest("hex");
}

async function uploadToCloudinary(buffer: Buffer, mime: string) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const secret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "namasvi/products";
  const signature = signCloudinary({ folder, timestamp }, secret);

  const form = new FormData();
  form.set("file", `data:${mime};base64,${buffer.toString("base64")}`);
  form.set("api_key", apiKey);
  form.set("timestamp", String(timestamp));
  form.set("signature", signature);
  form.set("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  const json = (await res.json()) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !json.secure_url) {
    throw new UploadError(json.error?.message || "Cloudinary upload failed.", 502);
  }
  return json.secure_url;
}

async function uploadLocally(buffer: Buffer, mime: string) {
  const dir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${EXT[mime] || "jpg"}`;
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/products/${name}`;
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

export async function uploadProductImage(file: File) {
  const mime = ALLOWED.has(file.type) ? file.type : mimeFromName(file.name);
  if (!ALLOWED.has(mime)) {
    throw new UploadError("Please upload a JPEG, PNG, WebP, GIF or AVIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Each image must be 5MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (cloudinaryConfigured()) {
    return uploadToCloudinary(buffer, mime);
  }
  return uploadLocally(buffer, mime);
}
