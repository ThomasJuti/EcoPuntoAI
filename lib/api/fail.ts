import { NextResponse } from "next/server";
import { HttpError } from "@/lib/storage/guard";

export function fail(err: unknown) {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : "Error";
  return NextResponse.json({ error: message }, { status: 400 });
}
