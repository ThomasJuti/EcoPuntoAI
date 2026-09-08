import { AppNav } from "../components/app-nav";

export default function AppShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Atmósfera fija pine/petroleum: el vidrio del header tiene algo que escarchar */}
      <div className="fixed inset-0 -z-10" aria-hidden>
        <div className="recycle-mancha">
          <span className="recycle-mancha__blob" />
          <span className="recycle-mancha__blob recycle-mancha__blob--b" />
        </div>
      </div>
      <AppNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 pt-3 pb-16 lg:px-16">
        {children}
      </div>
    </div>
  );
}
