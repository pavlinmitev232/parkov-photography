import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { deleteManagedImage } from "@/lib/storage/image-storage";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = siteSettingsSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid site settings" },
      { status: 400 },
    );
  }

  const previous = await getSiteSettings();
  await saveSiteSettings(parsed.data);

  const imageFields = [
    "heroImageUrl",
    "aboutImageUrl",
    "logoImageUrl",
  ] as const;
  const retainedImages = new Set(imageFields.map((field) => parsed.data[field]));

  await Promise.all(
    imageFields.map(async (field) => {
      const previousUrl = previous[field];
      if (previousUrl && !retainedImages.has(previousUrl)) {
        await deleteManagedImage(previousUrl, "site-assets");
      }
    }),
  );
  revalidatePublicHomeData({ includeSettings: true });

  return NextResponse.json({ ok: true });
}
