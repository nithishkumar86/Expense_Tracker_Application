import { describe, expect, it, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, ProfileNotFoundError } from "./get-current-profile";

type MockSupabaseClient = Awaited<ReturnType<typeof createClient>>;

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

vi.mock("next/server", () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

function mockClient(options: {
  sub: string | undefined;
  row: { name: string } | null;
  error?: { message: string } | null;
}) {
  const single = vi
    .fn()
    .mockResolvedValue({ data: options.row, error: options.error ?? null });
  const eq = vi.fn().mockReturnValue({ single });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });

  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getClaims: vi.fn().mockResolvedValue({
        data: options.sub ? { claims: { sub: options.sub } } : null,
      }),
    },
    from,
  } as unknown as MockSupabaseClient);

  return { eq };
}

describe("getCurrentProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the profile name for the signed-in user", async () => {
    mockClient({ sub: "user-a", row: { name: "Alice" } });

    const result = await getCurrentProfile();

    expect(result).toEqual({ name: "Alice" });
  });

  it("scopes the query to the session's own user id, never a caller-supplied one", async () => {
    const { eq } = mockClient({ sub: "user-a", row: { name: "Alice" } });

    await getCurrentProfile();

    expect(eq).toHaveBeenCalledWith("user_id", "user-a");
  });

  it("redirects to /login when there is no session", async () => {
    mockClient({ sub: undefined, row: null });

    await expect(getCurrentProfile()).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("throws ProfileNotFoundError when no row comes back", async () => {
    mockClient({ sub: "user-a", row: null });

    await expect(getCurrentProfile()).rejects.toThrow(ProfileNotFoundError);
  });
});
