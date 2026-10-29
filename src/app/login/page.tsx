import { Navbar } from "@/components/Navbar";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-blue-950">Log in</h1>
        <LoginForm />
      </main>
    </div>
  );
}
