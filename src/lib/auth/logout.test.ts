import { describe, expect, it, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./logout";

type MockSupabaseClient = Awaited<ReturnType<typeof createClient>>;

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs out and redirects to / when it succeeds", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createClient).mockResolvedValue({
      auth: { signOut },
    } as unknown as MockSupabaseClient);

    await expect(logout()).rejects.toThrow("REDIRECT");

    expect(signOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("still redirects to / when sign-out throws", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { signOut: vi.fn().mockRejectedValue(new Error("network down")) },
    } as unknown as MockSupabaseClient);

    await expect(logout()).rejects.toThrow("REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/");
  });
});
