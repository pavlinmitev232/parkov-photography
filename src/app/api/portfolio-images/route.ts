import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";

export const runtime = "nodejs";

const maxUploadSize = 8 * 1024 * 1024;
const uploadDirectory = path.join(
  process.cwd(),
  "public",
  "uploads",
  "portfolio",
);
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export async function POST(request: Request) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const upload = formData?.get("image");

  if (!(upload instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing image" }, { status: 400 });
  }

  const extension = allowedTypes.get(upload.type);

  if (!extension) {
    return NextResponse.json({ ok: false, error: "Unsupported image type" }, { status: 400 });
  }

  if (upload.size > maxUploadSize) {
    return NextResponse.json({ ok: false, error: "Image is too large" }, { status: 400 });
  }

  await mkdir(uploadDirectory, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const bytes = Buffer.from(await upload.arrayBuffer());

  await writeFile(filePath, bytes);

  return NextResponse.json({
    ok: true,
    url: `/uploads/portfolio/${fileName}`,
  });
}
