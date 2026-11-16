"use client";

import {
  AppSidebar,
  type AppSidebarItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@erp/miniapp-ui";
import { ClipboardListIcon, LayoutDashboardIcon, MenuIcon, TableIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, type ReactNode, useEffect, useState } from "react";
import { APP_SHELL } from "@/constants/nav";
import { isSidebarCollapsed } from "@/lib/sidebar-state";

const SIDEBAR_COLLAPSED_KEY = "{{name}}:sidebar-collapsed";

const SIDEBAR_ITEMS: AppSidebarItem[] = [
  { id: "main", label: "Main", type: "section" },
  {
    id: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    href: "/dashboard",
  },
  { id: "demos", label: "Demos", type: "section" },
  { id: "/table", label: "Table", href: "/table", icon: <TableIcon /> },
  {
    id: "/requests/new",
    label: "Multi-step form",
    href: "/requests/new",
    icon: <ClipboardListIcon />,
  },
];

function activeNavId(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "/dashboard";
  }
  if (pathname === "/table" || pathname.startsWith("/table/") || pathname.startsWith("/pipeline")) {
    return "/table";
  }
  if (pathname.startsWith("/requests")) return "/requests/new";
  return "/dashboard";
}

const segmentLabel = (segment: string) =>
  decodeURIComponent(segment)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** Breadcrumb from the URL: `/sites/42` -> Sites / 42. Every segment but the last links to its path. */
function PathBreadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const last = index === segments.length - 1;
          return (
            <Fragment key={href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{segmentLabel(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{segmentLabel(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        UI
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold text-sidebar-foreground">{APP_SHELL.title}</p>
        <p className="truncate text-xs text-muted-foreground">{APP_SHELL.subtitle}</p>
      </div>
    </div>
  );
}

function ShellSidebar({
  activeId,
  onNavigate,
  collapsible = false,
  collapsed,
  onCollapsedChange,
}: {
  activeId: string;
  onNavigate?: () => void;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  return (
    <AppSidebar
      items={SIDEBAR_ITEMS}
      activeId={activeId}
      collapsible={collapsible}
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      logo={<BrandLogo />}
      navLabel={APP_SHELL.navLabel}
      className="border-none bg-transparent shadow-none"
      renderLink={({ item, className, children, isActive, onClick }) => (
        <Link
          href={item.href ?? "#"}
          className={className}
          aria-current={isActive ? "page" : undefined}
          onClick={(event) => {
            onClick(event);
            onNavigate?.();
          }}
        >
          {children}
        </Link>
      )}
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeId = activeNavId(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(isSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY)));
  }, []);

  function onCollapsedChange(next: boolean) {
    setCollapsed(next);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
  }

  return (
    <div className="flex h-dvh gap-3 overflow-x-hidden bg-muted/40 p-3">
      <div className="hidden md:flex">
        <ShellSidebar
          activeId={activeId}
          collapsible
          collapsed={collapsed}
          onCollapsedChange={onCollapsedChange}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden md:rounded-md md:border md:bg-background">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label={APP_SHELL.openMenu}
              >
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>{APP_SHELL.title}</SheetTitle>
              </SheetHeader>
              <ShellSidebar activeId={activeId} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <PathBreadcrumb pathname={pathname} />
          {/* Page-wide actions (search, notifications, user menu) go here. */}
          <div className="ml-auto flex items-center gap-2" />
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
