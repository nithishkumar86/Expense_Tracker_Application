import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/auth/login", () => ({
  login: vi.fn(),
}));

import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("renders labelled email and password fields and a submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("renders an empty, live error region before submission", () => {
    const { container } = render(<LoginForm />);

    const region = container.querySelector("p[aria-live='polite']");
    expect(region).not.toBeNull();
    expect(region).toHaveTextContent("");
  });
});
