"use client";

import {
  Button,
  cn,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@erp/miniapp-ui";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { APP_SHELL, NAV_ITEMS } from "@/constants/nav";

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard" && pathname === "/") return true;
  if (href === "/table" && pathname.startsWith("/pipeline")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        UI
      </span>
      <span className="text-sm font-semibold">{APP_SHELL.title}</span>
    </Link>
  );
}

function NavLinks({
  pathname,
  vertical = false,
  onNavigate,
}: {
  pathname: string;
  vertical?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label={APP_SHELL.navLabel} className={cn("flex gap-1", vertical && "flex-col")}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-muted text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col overflow-x-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center gap-6 border-b px-4 md:px-6">
        <BrandLogo />
        <div className="hidden md:flex">
          <NavLinks pathname={pathname} />
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto md:hidden"
              aria-label={APP_SHELL.openMenu}
            >
              <MenuIcon className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-72 p-4">
            <SheetHeader className="px-0">
              <SheetTitle>{APP_SHELL.title}</SheetTitle>
            </SheetHeader>
            <NavLinks pathname={pathname} vertical onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
