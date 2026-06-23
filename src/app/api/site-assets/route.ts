import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";

export const runtime = "nodejs";

const maxUploadSize = 10 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export async function POST(request: Request) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const upload = formData?.get("image");
  if (!(upload instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing image" }, { status: 400 });
  }

  const extension = allowedTypes.get(upload.type);
  if (!extension || upload.size > maxUploadSize) {
    return NextResponse.json({ ok: false, error: "Invalid image" }, { status: 400 });
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "site");
  await mkdir(uploadDirectory, { recursive: true });
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  await writeFile(
    path.join(uploadDirectory, fileName),
    Buffer.from(await upload.arrayBuffer()),
  );

  return NextResponse.json({ ok: true, url: `/uploads/site/${fileName}` });
}
