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
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo.toString(),
  });

  if (error) {
    if (error.status === 429 || error.code === "over_email_send_rate_limit") {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "delivery_failed" },
      { status: 503 },
    );
  }

  // Return the same response whether the account exists or not.
  return NextResponse.json({ ok: true });
}
