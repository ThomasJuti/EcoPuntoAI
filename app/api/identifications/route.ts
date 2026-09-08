import { NextResponse } from "next/server";
import { fail } from "@/lib/api/fail";
import { isWasteKind } from "@/lib/catalog/kinds";
import {
  listIdentifications,
  updateIdentificationKind,
} from "@/lib/identify/history";
import { createClient, getUser } from "@/lib/supabase/server";
import { HttpError } from "@/lib/storage/guard";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) throw new HttpError(401, "Unauthenticated");
    const supabase = await createClient();
    return NextResponse.json({
      identifications: await listIdentifications(supabase),
    });
  } catch (err) {
    return fail(err);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUser();
    if (!user) throw new HttpError(401, "Unauthenticated");
    const body = (await request.json()) as { path?: unknown; kind?: unknown };
    const path = typeof body.path === "string" ? body.path : "";
    const kind = typeof body.kind === "string" ? body.kind : "";
    if (!path.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!isWasteKind(kind)) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    }
    const supabase = await createClient();
    await updateIdentificationKind(supabase, user.id, path, kind);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
