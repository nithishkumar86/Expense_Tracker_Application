"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formText, signupSchema, type AuthFormState } from "@/lib/auth/schemas";

const GENERIC_SIGNUP_ERROR = "Something went wrong creating your account.";

export async function signup(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    name: formText(formData, "name"),
    email: formText(formData, "email"),
  };
  const fail = (message: string): AuthFormState => ({ message, values });

  const parsed = signupSchema.safeParse({
    ...values,
    password: formText(formData, "password"),
  });
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Check your details and try again.",
    );
  }

  const { name, email, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error?.code === "user_already_exists") {
      return fail("Account already exists, please log in.");
    }
    if (error) {
      // Log only the code and status, never the email or password.
      console.error("signup failed:", error.code, error.status);
      return fail(GENERIC_SIGNUP_ERROR);
    }
    if (!data.session) {
      // Supabase returns no session while "Confirm email" is still on.
      console.error("signup: no session returned; is Confirm email on?");
      return fail("Could not finish signing up. Please try again shortly.");
    }
  } catch (error) {
    console.error(
      "signup threw:",
      error instanceof Error ? error.name : "unknown",
    );
    return fail(GENERIC_SIGNUP_ERROR);
  }

  // Outside the try: redirect() works by throwing.
  redirect("/dashboard");
}
