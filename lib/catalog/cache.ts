import { revalidateTag } from "next/cache";
import { POINTS_CACHE_TAG } from "@/lib/catalog/points";

export function bustPointsCache() {
  revalidateTag(POINTS_CACHE_TAG, "max");
}
