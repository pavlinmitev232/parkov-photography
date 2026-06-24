import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { ImageStorageError, storeImage } from "@/lib/storage/image-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const upload = formData?.get("image");
  if (!(upload instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing image" }, { status: 400 });
  }

  try {
    return NextResponse.json({
      ok: true,
      url: await storeImage(upload, "site-assets"),
    });
  } catch (error) {
    const status = error instanceof ImageStorageError ? error.status : 500;
    const message =
      error instanceof ImageStorageError ? error.message : "Image upload failed";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
