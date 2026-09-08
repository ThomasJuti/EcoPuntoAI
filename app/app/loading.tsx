import {
  HomeSkeleton,
  LoadingShell,
  PageHeaderSkeleton,
} from "@/app/components/ui-skeleton";

export default function AppLoading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton />
      <HomeSkeleton />
    </LoadingShell>
  );
}
