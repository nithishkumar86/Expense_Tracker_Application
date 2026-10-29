import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders Home and Expense as inert buttons when rendered", () => {
    render(<Navbar />);

    for (const label of ["Home", "Expense"]) {
      const button = screen.getByRole("button", { name: label });
      expect(button).toHaveAttribute("type", "button");
    }
  });

  it("renders Sign up and Login as links to their routes when rendered", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
