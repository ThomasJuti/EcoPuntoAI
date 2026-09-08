import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { Landing } from "./landing";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  // ponytail: cookie JWT only — no Auth getUser on the public landing
  const stayOnLanding = "landing" in params;
  if (!stayOnLanding && (await getSessionUser())) {
    redirect("/app");
  }
  return <Landing />;
}
