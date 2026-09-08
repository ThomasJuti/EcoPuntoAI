import { NextResponse } from "next/server";
import { fail } from "@/lib/api/fail";
import { requireAdmin } from "@/lib/auth/admin";
import { parsePointCreate } from "@/lib/catalog/point-input";
import { pointToRow } from "@/lib/catalog/point-row";
import { loadAdminPoints } from "@/lib/catalog/points";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    return NextResponse.json(await loadAdminPoints(supabase));
  } catch (err) {
    return fail(err);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const point = parsePointCreate(await request.json());
    const { error } = await supabase
      .from("collection_points")
      .insert(pointToRow(point));
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ point }, { status: 201 });
  } catch (err) {
    return fail(err);
  }
}
