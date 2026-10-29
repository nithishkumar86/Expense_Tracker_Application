import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

export interface SessionUpdate {
  /** The response carrying refreshed auth cookies; return or build on this. */
  response: NextResponse;
  /** True when the request carries a valid, verified session. */
  isAuthenticated: boolean;
}

/**
 * Refreshes the auth session cookies for `src/proxy.ts` and reports whether
 * the request is authenticated. Uses `getClaims()`, never `getSession()`:
 * `getClaims()` verifies the JWT signature and expiry, while `getSession()`
 * trusts the cookie as-is.
 */
export async function updateSession(
  request: NextRequest,
): Promise<SessionUpdate> {
  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  return { response, isAuthenticated: data !== null };
}
