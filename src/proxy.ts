import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";
import { resolveAuthRedirect } from "@/lib/auth/route-guard";

export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request);
  const redirectTo = resolveAuthRedirect(
    request.nextUrl.pathname,
    isAuthenticated,
  );

  if (!redirectTo) {
    return response;
  }

  const redirectResponse = NextResponse.redirect(
    new URL(redirectTo, request.url),
  );
  for (const cookie of response.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }
  return redirectResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
