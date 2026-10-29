import { Navbar } from "@/components/Navbar";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-blue-950">
          Create your account
        </h1>
        <SignupForm />
      </main>
    </div>
  );
}
