const PROTECTED_PREFIX = "/dashboard";
const AUTH_ONLY_PATHS = new Set(["/login", "/signup"]);

/**
 * Pure redirect decision for `src/proxy.ts`. Returns the path to redirect to,
 * or `null` when the request may proceed as-is.
 */
export function resolveAuthRedirect(
  pathname: string,
  isAuthenticated: boolean,
): string | null {
  const isProtected =
    pathname === PROTECTED_PREFIX ||
    pathname.startsWith(`${PROTECTED_PREFIX}/`);

  if (isProtected && !isAuthenticated) {
    return "/login";
  }

  if (AUTH_ONLY_PATHS.has(pathname) && isAuthenticated) {
    return "/dashboard";
  }

  return null;
}
