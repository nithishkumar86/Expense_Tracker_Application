// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { getClaims } = vi.hoisted(() => ({ getClaims: vi.fn() }));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({ auth: { getClaims } })),
}));

vi.mock("./env", () => ({
  getSupabaseEnv: vi.fn().mockReturnValue({
    url: "https://example.supabase.co",
    anonKey: "test-anon-key",
  }),
}));

import { updateSession } from "./proxy-session";

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reports authenticated when getClaims returns claims", async () => {
    getClaims.mockResolvedValue({ data: { claims: { sub: "user-a" } } });
    const request = new NextRequest("http://localhost/dashboard");

    const result = await updateSession(request);

    expect(result.isAuthenticated).toBe(true);
    expect(result.response).toBeDefined();
  });

  it("reports unauthenticated when getClaims returns no data", async () => {
    getClaims.mockResolvedValue({ data: null });
    const request = new NextRequest("http://localhost/dashboard");

    const result = await updateSession(request);

    expect(result.isAuthenticated).toBe(false);
  });
});
