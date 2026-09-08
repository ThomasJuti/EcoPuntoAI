import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";
import { assertAuthenticated, HttpError } from "@/lib/storage/guard";
import { identifyFromBytes } from "@/lib/vision/identify";

export async function POST(request: Request) {
  const user = await getUser();
  const userId = user?.id;

  try {
    assertAuthenticated(userId);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 401;
    return NextResponse.json({ error: "Unauthenticated" }, { status });
  }

  const body = (await request.json()) as { path?: unknown };
  const path = body.path;
  if (typeof path !== "string" || !path.startsWith(`${userId}/`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("device-photos").download(path);
  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await identifyFromBytes(
    await data.arrayBuffer(),
    data.type || "image/jpeg",
  );
  return NextResponse.json({ ...result, path });
}
