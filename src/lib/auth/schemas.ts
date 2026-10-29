import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(80, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .email("Enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/** Shared shape for `useActionState` in the signup and login forms. */
export interface AuthFormState {
  message: string;
  /** Echoed back so React 19's post-action form reset doesn't wipe them. */
  values?: { name?: string; email?: string };
}

export const initialAuthFormState: AuthFormState = { message: "" };

/** Reads a text field from FormData; files and missing keys become "". */
export function formText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
