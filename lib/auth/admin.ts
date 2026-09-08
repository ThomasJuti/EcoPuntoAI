import { cache } from "react";
import { createClient, getUser } from "@/lib/supabase/server";
import { assertAdmin, HttpError } from "@/lib/storage/guard";

export const getProfile = cache(async () => {
  const user = await getUser();
  if (!user) return { user: null, isAdmin: false, supabase: null };
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  return { user, isAdmin: Boolean(data?.is_admin), supabase };
});

export async function requireAdmin() {
  const { user, isAdmin, supabase } = await getProfile();
  if (!user || !supabase) throw new HttpError(401, "Unauthenticated");
  assertAdmin(isAdmin);
  return { user, supabase };
}

export async function getIsAdmin() {
  return (await getProfile()).isAdmin;
}
