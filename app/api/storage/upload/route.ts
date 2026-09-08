import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";
import { assertAuthenticated, HttpError, objectPath } from "@/lib/storage/guard";

export async function POST(request: Request) {
  const user = await getUser();
  const userId = user?.id;

  try {
    assertAuthenticated(userId);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 401;
    return NextResponse.json({ error: "Unauthenticated" }, { status });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const supabase = await createClient();
  const path = objectPath(userId, crypto.randomUUID());
  const { error } = await supabase.storage.from("device-photos").upload(path, file);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  return NextResponse.json({ path });
}
