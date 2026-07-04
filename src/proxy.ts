import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { adminPath } from "./lib/admin-path";
import { refreshSupabaseAuth } from "./lib/supabase/proxy";

const intlMiddleware = createMiddleware(routing);
const adminPathSegment = adminPath.replace("/", "");

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  const isOwnerPortalRoute =
    request.nextUrl.pathname.split("/").includes(adminPathSegment);

  return isOwnerPortalRoute ? refreshSupabaseAuth(request, response) : response;
}

export const config = {
  matcher: ["/", "/(bg|en)/parkov-owner-portal-7f3a/:path*"],
};
