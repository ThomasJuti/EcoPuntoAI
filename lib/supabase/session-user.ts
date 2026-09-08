import { cache } from "react";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  email: string | undefined;
  name: string | undefined;
  avatarUrl: string | undefined;
};

function str(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function decodeJwt(accessToken: string): Record<string, unknown> | null {
  const payload = accessToken.split(".")[1];
  if (!payload) return null;
  try {
    const json = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function claimsAvatar(claims: Record<string, unknown>): {
  name: string | undefined;
  avatarUrl: string | undefined;
} {
  const meta =
    claims.user_metadata && typeof claims.user_metadata === "object"
      ? (claims.user_metadata as Record<string, unknown>)
      : {};
  return {
    name: str(meta.full_name) ?? str(meta.name) ?? str(claims.name),
    avatarUrl:
      str(meta.avatar_url) ?? str(meta.picture) ?? str(claims.picture),
  };
}

export function isAuthTokenCookie(name: string): boolean {
  return /(^|-)auth-token(\.\d+)?$/.test(name);
}

export function combineAuthTokenCookies(
  all: { name: string; value: string }[],
): string | null {
  const auth = all.filter((cookie) => isAuthTokenCookie(cookie.name));
  if (auth.length === 0) return null;
  const whole = auth.filter((cookie) => !/\.\d+$/.test(cookie.name));
  if (whole.length > 0) {
    return whole
      .slice()
      .sort((a, b) => b.value.length - a.value.length)[0]?.value ?? null;
  }
  const chunks = auth
    .map((cookie) => {
      const match = cookie.name.match(/\.(\d+)$/);
      return match ? { index: Number(match[1]), value: cookie.value } : null;
    })
    .filter((row): row is { index: number; value: string } => row !== null)
    .sort((a, b) => a.index - b.index);
  if (chunks.length === 0) return null;
  return chunks.map((row) => row.value).join("");
}

export function accessTokenFromCookieValue(raw: string): string | null {
  let trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    trimmed = decodeURIComponent(trimmed);
  } catch {
    // already decoded
  }
  const candidates = [trimmed];
  if (trimmed.startsWith("base64-")) {
    try {
      candidates.push(Buffer.from(trimmed.slice(7), "base64").toString("utf8"));
    } catch {
      // ignore
    }
  }
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as { access_token?: string };
      if (typeof parsed.access_token === "string" && parsed.access_token) {
        return parsed.access_token;
      }
    } catch {
      // next candidate
    }
  }
  return null;
}

export function sessionUserFromAccessToken(token: string): SessionUser | null {
  const claims = decodeJwt(token);
  if (!claims) return null;
  const sub = str(claims.sub);
  if (!sub) return null;
  const exp = claims.exp;
  if (typeof exp === "number" && exp * 1000 < Date.now()) return null;
  const extra = claimsAvatar(claims);
  return {
    id: sub,
    email: str(claims.email),
    name: extra.name,
    avatarUrl: extra.avatarUrl,
  };
}

export function sessionUserFromSupabaseUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): SessionUser {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? undefined,
    name: str(meta.full_name) ?? str(meta.name),
    avatarUrl: str(meta.avatar_url) ?? str(meta.picture),
  };
}

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const raw = combineAuthTokenCookies((await cookies()).getAll());
  if (!raw) return null;
  const token = accessTokenFromCookieValue(raw);
  if (!token) return null;
  return sessionUserFromAccessToken(token);
});
