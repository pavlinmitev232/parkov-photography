import { adminPath } from "@/lib/admin-path";
import { getOwnerAuthProvider } from "@/lib/auth/owner-auth-provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function cleanRedirectPage(target: string) {
  const safeTarget = JSON.stringify(target);

  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${escapeAttribute(target)}"><title>Redirecting</title></head><body><script>window.location.replace(${safeTarget});</script></body></html>`,
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = `/bg${adminPath}/update-password`;

  if (getOwnerAuthProvider() !== "supabase") {
    return cleanRedirectPage(`/bg${adminPath}/login`);
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

  return cleanRedirectPage(error ? `/bg${adminPath}/login` : next);
}
