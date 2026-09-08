import { LoadingShell, Pulse } from "@/app/components/ui-skeleton";

export default function AppLoading() {
  return (
    <LoadingShell>
      <div className="flex min-h-[62dvh] flex-col justify-center">
        {/* Título amplio de Inicio */}
        <Pulse className="h-14 w-80 max-w-full" />
        <div className="mt-6 max-w-[46ch] space-y-3">
          <Pulse className="h-5 w-full" />
          <Pulse className="h-5 w-2/3" />
        </div>
        {/* CTA «Identificar dispositivo» */}
        <Pulse className="mt-10 h-14 w-56 max-w-full" />
      </div>
    </LoadingShell>
  );
}
