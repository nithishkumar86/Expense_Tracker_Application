import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

describe("Hero", () => {
  it("renders the welcome heading when rendered", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Welcome To Expense Tracker",
      }),
    ).toBeInTheDocument();
  });

  it("renders the tracker image with descriptive alt text when rendered", () => {
    render(<Hero />);

    expect(screen.getByAltText("Expense Tracker")).toBeInTheDocument();
  });
});
