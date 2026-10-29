import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Fully mocked so the test never loads the real Supabase server client.
vi.mock("@/lib/profile/get-current-profile", () => ({
  getCurrentProfile: vi.fn(),
  ProfileNotFoundError: class ProfileNotFoundError extends Error {},
}));

import {
  getCurrentProfile,
  ProfileNotFoundError,
} from "@/lib/profile/get-current-profile";
import { DashboardGreeting } from "./DashboardGreeting";

describe("DashboardGreeting", () => {
  it("greets the user by name and shows the empty state when there is a profile", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue({ name: "Alice" });

    render(await DashboardGreeting());

    expect(
      screen.getByRole("heading", { name: "Hi, Alice" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No expenses yet.")).toBeInTheDocument();
  });

  it("shows an error message when the profile cannot be found", async () => {
    vi.mocked(getCurrentProfile).mockRejectedValue(new ProfileNotFoundError());

    render(await DashboardGreeting());

    expect(screen.getByText(/couldn't load your profile/i)).toBeInTheDocument();
  });
});
