import { NextResponse } from "next/server";
import { fail } from "@/lib/api/fail";
import { getUser, createClient } from "@/lib/supabase/server";
import { parseDeliveryInput } from "@/lib/catalog/deliveries";
import { HttpError } from "@/lib/storage/guard";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) throw new HttpError(401, "Unauthenticated");
    const input = parseDeliveryInput(await request.json());
    const supabase = await createClient();
    const { error } = await supabase.from("deliveries").insert({
      user_id: user.id,
      point_id: input.pointId,
      point_name: input.pointName,
      waste_kind: input.kind,
      storage_path: input.path,
      distance_km: input.km,
    });
    if (error?.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return fail(err);
  }
}
