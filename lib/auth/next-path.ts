export function safeNext(next: string | null | undefined) {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/app/escanear";
}
