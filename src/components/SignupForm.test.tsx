import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/auth/signup", () => ({
  signup: vi.fn(),
}));

import { SignupForm } from "./SignupForm";

describe("SignupForm", () => {
  it("renders labelled name, email, and password fields and a submit button", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders an empty, live error region before submission", () => {
    const { container } = render(<SignupForm />);

    const region = container.querySelector("p[aria-live='polite']");
    expect(region).not.toBeNull();
    expect(region).toHaveTextContent("");
  });
});
