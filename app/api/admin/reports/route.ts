import { NextResponse } from "next/server";
import { fail } from "@/lib/api/fail";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("point_reports")
      .select(
        "id,point_id,point_name,reason,comment,status,created_at,resolved_at",
      )
      .eq("status", "open")
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({
        reports: [],
        warning:
          "Aplica supabase/migrations/0004_reports.sql en el SQL editor de Supabase.",
      });
    }
    return NextResponse.json({ reports: data ?? [] });
  } catch (err) {
    return fail(err);
  }
}
