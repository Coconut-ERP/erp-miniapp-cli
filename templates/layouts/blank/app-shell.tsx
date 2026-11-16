import type { ReactNode } from "react";

/**
 * No chrome: for apps embedded in an ERP screen that already has its own navigation.
 * Pages link to each other with `next/link`; see `src/constants/nav.ts` for the routes.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-dvh flex-col gap-4 overflow-auto bg-background p-4 md:p-6">
      {children}
    </main>
  );
}
