"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    // The user still leaves the app; the failure is kept for diagnosis.
    console.error(
      "logout threw:",
      error instanceof Error ? error.name : "unknown",
    );
  }

  // Outside the try: redirect() works by throwing.
  redirect("/");
}
