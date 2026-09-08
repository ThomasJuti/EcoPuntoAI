import { NextResponse } from "next/server";
import { fail } from "@/lib/api/fail";
import { requireAdmin } from "@/lib/auth/admin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const body = (await request.json()) as { status?: unknown };
    const status = body.status;
    if (status !== "resolved" && status !== "dismissed") {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("point_reports")
      .update({
        status,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    return fail(err);
  }
}
