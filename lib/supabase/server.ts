import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getSessionUser,
  sessionUserFromSupabaseUser,
} from "@/lib/supabase/session-user";

export { getSessionUser } from "@/lib/supabase/session-user";

export const createClient = cache(async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component — proxy refreshes the session.
        }
      },
    },
  });
});

export const getUser = cache(async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
});

/** Cookie JWT first; Auth server only if the cookie did not parse. */
export const resolveSessionUser = cache(async () => {
  const fromCookie = await getSessionUser();
  if (fromCookie) return fromCookie;
  const user = await getUser();
  return user ? sessionUserFromSupabaseUser(user) : null;
});
