import { LoadingShell, ResultSkeleton } from "@/app/components/ui-skeleton";

export default function ResultadoLoading() {
  return (
    <LoadingShell>
      <ResultSkeleton />
    </LoadingShell>
  );
}
