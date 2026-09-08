import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fail } from "@/lib/api/fail";
import { parseAnswers, type Conditions } from "@/lib/catalog/conditions";
import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";
import {
  listIdentifications,
  updateIdentification,
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
    const body = (await request.json()) as {
      path?: unknown;
      kind?: unknown;
      answers?: unknown;
    };
    const path = typeof body.path === "string" ? body.path : "";
    if (!path.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const patch: { kind?: WasteKind; answers?: Conditions } = {};
    if (body.kind !== undefined) {
      if (typeof body.kind !== "string" || !isWasteKind(body.kind)) {
        return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
      }
      patch.kind = body.kind;
    }
    if (body.answers !== undefined) {
      patch.answers = parseAnswers(body.answers);
    }
    if (!patch.kind && patch.answers === undefined) {
      return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
    }
    const supabase = await createClient();
    await updateIdentification(supabase, user.id, path, patch);
    revalidatePath("/app");
    revalidatePath("/app/resultado");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
