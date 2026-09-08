import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });

  const path = request.nextUrl.pathname;
  const purpose = request.headers.get("purpose");
  const prefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    purpose === "prefetch";
  const gated =
    path.startsWith("/app/escanear") ||
    path.startsWith("/app/resultado") ||
    path.startsWith("/app/perfil") ||
    path.startsWith("/app/admin") ||
    path.startsWith("/auth") ||
    (path.startsWith("/api/") && path !== "/api/points");
  const skipRefresh = prefetch || (request.method === "GET" && !gated);
  if (skipRefresh) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
