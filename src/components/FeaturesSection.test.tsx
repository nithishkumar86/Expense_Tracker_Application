import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturesSection } from "./FeaturesSection";

describe("FeaturesSection", () => {
  it("renders all 4 feature cards with the expected copy when rendered", () => {
    render(<FeaturesSection />);

    const titles = [
      "Track every spending",
      "Control your budget",
      "Save more money",
      "Your data stays private",
    ];
    for (const title of titles) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });
});
