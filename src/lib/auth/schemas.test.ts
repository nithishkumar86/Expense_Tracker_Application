import { describe, expect, it } from "vitest";
import { formText, loginSchema, signupSchema } from "./schemas";

describe("signupSchema", () => {
  it("accepts a valid name, email, and password", () => {
    const result = signupSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = signupSchema.safeParse({
      name: "  ",
      email: "ada@example.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      name: "Ada",
      email: "not-an-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    const result = loginSchema.safeParse({
      email: "ada@example.com",
      password: "x",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "ada@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("formText", () => {
  it("returns the string value when the field is present", () => {
    const data = new FormData();
    data.set("email", "ada@example.com");
    expect(formText(data, "email")).toBe("ada@example.com");
  });

  it("returns an empty string when the field is missing", () => {
    expect(formText(new FormData(), "email")).toBe("");
  });
});
