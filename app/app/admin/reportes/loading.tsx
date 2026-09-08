import { AdminListSkeleton, LoadingShell } from "@/app/components/ui-skeleton";

export default function AdminReportesLoading() {
  return (
    <LoadingShell>
      <AdminListSkeleton />
    </LoadingShell>
  );
}
