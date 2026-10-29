import { describe, expect, it, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { login } from "./login";
import { initialAuthFormState } from "./schemas";

type MockSupabaseClient = Awaited<ReturnType<typeof createClient>>;

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

function formData(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
}

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /dashboard when the credentials are valid", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      },
    } as unknown as MockSupabaseClient);

    await expect(
      login(
        initialAuthFormState,
        formData({ email: "ada@example.com", password: "password123" }),
      ),
    ).rejects.toThrow("REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns a generic invalid-credentials message when Supabase rejects the login", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        signInWithPassword: vi
          .fn()
          .mockResolvedValue({ error: { message: "bad" } }),
      },
    } as unknown as MockSupabaseClient);

    const result = await login(
      initialAuthFormState,
      formData({ email: "ada@example.com", password: "wrong" }),
    );

    expect(result.message).toBe("Invalid email or password.");
    expect(result.values?.email).toBe("ada@example.com");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns a validation message without calling Supabase for invalid input", async () => {
    const result = await login(
      initialAuthFormState,
      formData({ email: "not-an-email", password: "" }),
    );

    expect(result.message).not.toBe("");
    expect(createClient).not.toHaveBeenCalled();
  });
});
