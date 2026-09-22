import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleError, jsonError } from "@/lib/api";
import { uploadProductImage, UploadError } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const form = await req.formData();
    const files = form
      .getAll("files")
      .concat(form.get("file") ? [form.get("file") as FormDataEntryValue] : [])
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!files.length) {
      return jsonError("Choose at least one image to upload.");
    }

    const urls: string[] = [];
    for (const file of files) {
      urls.push(await uploadProductImage(file));
    }

    return NextResponse.json({ urls, url: urls[0] });
  } catch (e) {
    if (e instanceof UploadError) {
      return jsonError(e.message, e.status);
    }
    return handleError(e);
  }
}
