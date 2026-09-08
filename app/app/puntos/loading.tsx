import {
  LoadingShell,
  PageHeaderSkeleton,
  PointsBrowserSkeleton,
} from "@/app/components/ui-skeleton";

export default function PuntosLoading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton />
      <PointsBrowserSkeleton />
    </LoadingShell>
  );
}
