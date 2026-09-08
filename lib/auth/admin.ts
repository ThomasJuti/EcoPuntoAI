import { createClient, getUser } from "@/lib/supabase/server";
import { assertAdmin, HttpError } from "@/lib/storage/guard";

export async function requireAdmin() {
  const user = await getUser();
  if (!user) throw new HttpError(401, "Unauthenticated");
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  assertAdmin(data?.is_admin);
  return { user, supabase };
}

export async function getIsAdmin() {
  const user = await getUser();
  if (!user) return false;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    return Boolean(data?.is_admin);
  } catch {
    return false;
  }
}
