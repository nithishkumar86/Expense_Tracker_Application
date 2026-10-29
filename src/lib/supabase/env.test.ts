import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getSupabaseEnv } from "./env";

const ORIGINAL_ENV = { ...process.env };

describe("getSupabaseEnv", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns the url and anon key when both are set", () => {
    expect(getSupabaseEnv()).toEqual({
      url: "https://example.supabase.co",
      anonKey: "test-anon-key",
    });
  });

  it("throws when the url is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(() => getSupabaseEnv()).toThrow();
  });

  it("throws when the anon key is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(() => getSupabaseEnv()).toThrow();
  });
});
