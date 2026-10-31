export const APP_SHELL = {
  title: "{{title}}",
  subtitle: "ERP mini app",
  navLabel: "Navigation",
  openMenu: "Open menu",
} as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/table", label: "Table" },
  { href: "/requests/new", label: "Multi-step form" },
] as const;
