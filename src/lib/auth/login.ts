"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formText, loginSchema, type AuthFormState } from "@/lib/auth/schemas";

const INVALID_CREDENTIALS = "Invalid email or password.";

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = { email: formText(formData, "email") };
  const fail = (message: string): AuthFormState => ({ message, values });

  const parsed = loginSchema.safeParse({
    ...values,
    password: formText(formData, "password"),
  });
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Check your details and try again.",
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    // One message for every failure, so it never reveals which emails exist.
    if (error) {
      return fail(INVALID_CREDENTIALS);
    }
  } catch (error) {
    console.error(
      "login threw:",
      error instanceof Error ? error.name : "unknown",
    );
    return fail(INVALID_CREDENTIALS);
  }

  // Outside the try: redirect() works by throwing.
  redirect("/dashboard");
}
