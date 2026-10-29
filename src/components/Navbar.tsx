import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full border-b border-blue-100 bg-white">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="text-sm font-medium text-blue-900 transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Home
          </button>
          <button
            type="button"
            className="text-sm font-medium text-blue-900 transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Expense
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="rounded-full border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
