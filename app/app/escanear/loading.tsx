import { CaptureSkeleton, LoadingShell } from "@/app/components/ui-skeleton";

export default function EscanearLoading() {
  return (
    <LoadingShell>
      <CaptureSkeleton />
    </LoadingShell>
  );
}
