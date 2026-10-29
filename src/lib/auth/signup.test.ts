import { describe, expect, it, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signup } from "./signup";
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

describe("signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /dashboard when signup succeeds with a session", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        signUp: vi
          .fn()
          .mockResolvedValue({ data: { session: {} }, error: null }),
      },
    } as unknown as MockSupabaseClient);

    await expect(
      signup(
        initialAuthFormState,
        formData({
          name: "Ada",
          email: "ada@example.com",
          password: "password123",
        }),
      ),
    ).rejects.toThrow("REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns an already-registered message when the email exists", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: null },
          error: { code: "user_already_exists" },
        }),
      },
    } as unknown as MockSupabaseClient);

    const result = await signup(
      initialAuthFormState,
      formData({
        name: "Ada",
        email: "ada@example.com",
        password: "password123",
      }),
    );

    expect(result.message).toBe("Account already exists, please log in.");
    expect(result.values).toEqual({ name: "Ada", email: "ada@example.com" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns a validation message without calling Supabase for invalid input", async () => {
    const result = await signup(
      initialAuthFormState,
      formData({ name: "", email: "not-an-email", password: "short" }),
    );

    expect(result.message).not.toBe("");
    expect(createClient).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
