"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth/login";
import { initialAuthFormState } from "@/lib/auth/schemas";
import { FormField } from "@/components/FormField";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <FormField
        id="login-email"
        defaultValue={state.values?.email}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <FormField
        id="login-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
      />
      <p aria-live="polite" className="text-sm text-red-600">
        {state.message}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
