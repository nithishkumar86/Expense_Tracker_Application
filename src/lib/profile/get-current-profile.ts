import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface CurrentProfile {
  name: string;
}

export class ProfileNotFoundError extends Error {
  constructor() {
    super("No profile found for the current user.");
    this.name = "ProfileNotFoundError";
  }
}

/**
 * Loads the signed-in user's own profile. Takes no id argument: the filter
 * always comes from the verified session, never from a caller-supplied value.
 */
export async function getCurrentProfile(): Promise<CurrentProfile> {
  // Token checks compare expiry to the current time, so never prerender this.
  await connection();
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new ProfileNotFoundError();
  }

  return { name: data.name };
}
