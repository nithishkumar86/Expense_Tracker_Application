import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardGreeting } from "@/components/DashboardGreeting";
import { LogoutButton } from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar />
      <main className="flex flex-1 flex-col gap-6 px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <Suspense
            fallback={<p className="text-blue-700">Loading your dashboard…</p>}
          >
            <DashboardGreeting />
          </Suspense>
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
