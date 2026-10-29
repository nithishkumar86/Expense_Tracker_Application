import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoutButton } from "./LogoutButton";

describe("LogoutButton", () => {
  it("renders a submit button labelled Log out", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "Log out" });
    expect(button).toHaveAttribute("type", "submit");
  });
});
