import {
  LoadingShell,
  PageHeaderSkeleton,
  PointsBrowserSkeleton,
} from "@/app/components/ui-skeleton";

export default function MapaLoading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton />
      <PointsBrowserSkeleton />
    </LoadingShell>
  );
}
