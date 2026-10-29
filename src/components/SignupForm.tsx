"use client";

import { useActionState } from "react";
import { signup } from "@/lib/auth/signup";
import { initialAuthFormState } from "@/lib/auth/schemas";
import { FormField } from "@/components/FormField";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signup,
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <FormField
        id="signup-name"
        defaultValue={state.values?.name}
        name="name"
        label="Name"
        type="text"
        autoComplete="name"
      />
      <FormField
        id="signup-email"
        defaultValue={state.values?.email}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <FormField
        id="signup-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
      />
      <p aria-live="polite" className="text-sm text-red-600">
        {state.message}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Signing up…" : "Sign up"}
      </button>
    </form>
  );
}
