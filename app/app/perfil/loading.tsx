import { LoadingShell, ProfileSkeleton } from "@/app/components/ui-skeleton";

export default function PerfilLoading() {
  return (
    <LoadingShell>
      <ProfileSkeleton />
    </LoadingShell>
  );
}
