import { NextResponse } from "next/server";
import { fail } from "@/lib/api/fail";
import { requireAdmin } from "@/lib/auth/admin";
import { parsePointPatch } from "@/lib/catalog/point-input";
import { pointPatchToRow } from "@/lib/catalog/point-row";
import { bustPointsCache } from "@/lib/catalog/cache";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const patch = parsePointPatch(await request.json());
    const { data, error } = await supabase
      .from("collection_points")
      .update(pointPatchToRow(patch))
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Punto no encontrado" }, { status: 404 });
    }
    bustPointsCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("collection_points")
      .update({ is_active: false, last_verified_at: today })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Punto no encontrado" }, { status: 404 });
    }
    bustPointsCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
