import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import {
  deleteManagedImage,
  ImageStorageError,
  storeImage,
} from "@/lib/storage/image-storage";
import {
  maxPortfolioBatchImages,
  portfolioImageUrlSchema,
} from "@/lib/validations/portfolio";

export const runtime = "nodejs";

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

  try {
    return NextResponse.json({
      ok: true,
      url: await storeImage(upload, "portfolio"),
    });
  } catch (error) {
    const status = error instanceof ImageStorageError ? error.status : 500;
    const message =
      error instanceof ImageStorageError ? error.message : "Image upload failed";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = portfolioImageUrlSchema.array().max(maxPortfolioBatchImages).safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid images" }, { status: 400 });
  }

  await Promise.all(
    parsed.data.map((url) => deleteManagedImage(url, "portfolio")),
  );
  return NextResponse.json({ ok: true });
}
