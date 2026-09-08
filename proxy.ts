import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/app/escanear/:path*",
    "/app/resultado/:path*",
    "/app/admin/:path*",
    "/auth/:path*",
    "/api/((?!points$|identifications$).*)",
  ],
};
