import { AppNav } from "../components/app-nav";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export default async function AppShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Atmósfera fija pine/petroleum: el vidrio del header tiene algo que escarchar */}
      <div className="fixed inset-0 -z-10" aria-hidden>
        <div className="recycle-mancha">
          <span className="recycle-mancha__blob" />
          <span className="recycle-mancha__blob recycle-mancha__blob--b" />
        </div>
      </div>
      <AppNav locale={locale} labels={messages[locale].nav} />
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 pt-3 pb-16 lg:px-16">
        {children}
      </div>
    </div>
  );
}
