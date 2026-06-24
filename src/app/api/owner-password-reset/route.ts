import { NextResponse } from "next/server";
import { getOwnerAuthProvider } from "@/lib/auth/owner-auth-provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (getOwnerAuthProvider() !== "supabase") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const redirectTo = new URL("/api/owner-auth-callback", origin);

  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo.toString(),
  });

  // Return the same response whether the account exists or not.
  return NextResponse.json({ ok: true });
}
