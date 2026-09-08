import {
  LearnSkeleton,
  LoadingShell,
  PageHeaderSkeleton,
} from "@/app/components/ui-skeleton";

export default function AprenderLoading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton />
      <LearnSkeleton />
    </LoadingShell>
  );
}
