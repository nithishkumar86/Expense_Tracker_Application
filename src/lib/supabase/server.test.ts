import { describe, expect, it, vi, beforeEach } from "vitest";

const { getAll, set, createServerClient } = vi.hoisted(() => ({
  getAll: vi.fn().mockReturnValue([]),
  set: vi.fn(),
  createServerClient: vi.fn().mockReturnValue({ auth: {} }),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ getAll, set }),
}));

vi.mock("@supabase/ssr", () => ({ createServerClient }));

vi.mock("./env", () => ({
  getSupabaseEnv: vi.fn().mockReturnValue({
    url: "https://example.supabase.co",
    anonKey: "test-anon-key",
  }),
}));

import { createClient } from "./server";

describe("createClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAll.mockReturnValue([]);
  });

  it("builds a Supabase client from the request cookies", async () => {
    const client = await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "test-anon-key",
      expect.objectContaining({ cookies: expect.any(Object) }),
    );
    expect(client).toBeDefined();
  });

  it("swallows a cookie-set error raised when called from a Server Component", async () => {
    await createClient();
    const { cookies: cookiesOption } = createServerClient.mock.calls[0][2];

    set.mockImplementation(() => {
      throw new Error("cannot set cookies here");
    });

    expect(() =>
      cookiesOption.setAll([{ name: "sb-token", value: "x", options: {} }]),
    ).not.toThrow();
  });
});
