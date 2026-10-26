import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders Home, Expense, Sign up, and Login as inert buttons when rendered", () => {
    render(<Navbar />);

    const labels = ["Home", "Expense", "Sign up", "Login"];
    for (const label of labels) {
      const button = screen.getByRole("button", { name: label });
      expect(button).toHaveAttribute("type", "button");
      expect(button).not.toHaveAttribute("href");
    }
  });

  it("renders no anchor links when rendered", () => {
    render(<Navbar />);

    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
