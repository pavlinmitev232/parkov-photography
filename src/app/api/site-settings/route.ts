import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { saveSiteSettings } from "@/lib/site-settings";
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

  await saveSiteSettings(parsed.data);
  return NextResponse.json({ ok: true });
}
