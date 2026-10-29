import { describe, expect, it } from "vitest";
import { resolveAuthRedirect } from "./route-guard";

describe("resolveAuthRedirect", () => {
  it("redirects to /login when visiting /dashboard without a session", () => {
    expect(resolveAuthRedirect("/dashboard", false)).toBe("/login");
  });

  it("redirects to /login when visiting a nested dashboard path without a session", () => {
    expect(resolveAuthRedirect("/dashboard/settings", false)).toBe("/login");
  });

  it("redirects to /dashboard when visiting /login with a session", () => {
    expect(resolveAuthRedirect("/login", true)).toBe("/dashboard");
  });

  it("redirects to /dashboard when visiting /signup with a session", () => {
    expect(resolveAuthRedirect("/signup", true)).toBe("/dashboard");
  });

  it("allows visiting /dashboard with a session", () => {
    expect(resolveAuthRedirect("/dashboard", true)).toBeNull();
  });

  it("allows visiting /login without a session", () => {
    expect(resolveAuthRedirect("/login", false)).toBeNull();
  });
});
