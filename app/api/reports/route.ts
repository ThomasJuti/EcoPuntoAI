import { NextResponse } from "next/server";
import { fail } from "@/lib/api/fail";
import { getUser, createClient } from "@/lib/supabase/server";
import { parseReportInput } from "@/lib/catalog/reports";
import { HttpError } from "@/lib/storage/guard";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) throw new HttpError(401, "Unauthenticated");
    const input = parseReportInput(await request.json());
    const supabase = await createClient();
    const { error } = await supabase.from("point_reports").insert({
      point_id: input.pointId,
      point_name: input.pointName,
      user_id: user.id,
      reason: input.reason,
      comment: input.comment,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return fail(err);
  }
}
