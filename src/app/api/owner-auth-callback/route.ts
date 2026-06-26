import { adminPath } from "@/lib/admin-path";
import { getOwnerAuthProvider } from "@/lib/auth/owner-auth-provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = `/bg${adminPath}/update-password`;

  if (getOwnerAuthProvider() !== "supabase") {
    return Response.redirect(`${url.origin}/bg${adminPath}/login`, 303);
  }

  const supabase = await createSupabaseServerClient();
  const { error } =
    tokenHash && type === "recovery"
      ? await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { error: new Error("Missing owner recovery token") };

  return Response.redirect(
    `${url.origin}${error ? `/bg${adminPath}/login` : next}`,
    303,
  );
}
