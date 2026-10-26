import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCard } from "./FeatureCard";

describe("FeatureCard", () => {
  it("renders the given title and description when rendered", () => {
    render(
      <FeatureCard
        title="Track every spending"
        description="Log each expense."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Track every spending" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Log each expense.")).toBeInTheDocument();
  });
});
