import { AdminListSkeleton, LoadingShell } from "@/app/components/ui-skeleton";

export default function AdminPuntosLoading() {
  return (
    <LoadingShell>
      <AdminListSkeleton />
    </LoadingShell>
  );
}
