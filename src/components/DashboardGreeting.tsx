import {
  getCurrentProfile,
  ProfileNotFoundError,
} from "@/lib/profile/get-current-profile";

export async function DashboardGreeting() {
  let name: string | null = null;
  try {
    name = (await getCurrentProfile()).name;
  } catch (error) {
    if (!(error instanceof ProfileNotFoundError)) {
      throw error;
    }
  }

  if (name === null) {
    return (
      <p className="text-red-600">
        We couldn&apos;t load your profile. Please try again.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-blue-950">Hi, {name}</h1>
      <p className="text-blue-700">No expenses yet.</p>
    </div>
  );
}
