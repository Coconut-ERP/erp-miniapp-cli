"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DonutChart,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LineChart,
  PageHeader,
  StatisticCard,
} from "@erp/miniapp-ui";
import {
  BriefcaseIcon,
  CalendarOffIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  DownloadIcon,
  PercentIcon,
  PlusIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { HRM_DASHBOARD_PAGE } from "@/constants/hrm-dashboard";

const TINT = {
  primary: "bg-primary/10 text-primary",
  orange: "bg-orange-50 text-orange-600",
  violet: "bg-secondary text-violet-700",
  rose: "bg-destructive/10 text-destructive",
} as const;

const STATUS_CLASS = {
  Interview: "bg-primary/10 text-primary border-transparent",
  Applied: "bg-orange-50 text-orange-700 border-transparent",
  "Offer Made": "bg-secondary text-violet-700 border-transparent",
  Hired: "bg-success/10 text-success border-transparent",
} as const;

const METRIC_ICONS = {
  leave: CalendarOffIcon,
  attendance: PercentIcon,
  positions: BriefcaseIcon,
  payroll: WalletIcon,
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function HrmDashboard() {
  const copy = HRM_DASHBOARD_PAGE;

  return (
    <>
      <PageHeader
        title={copy.header.title}
        description={copy.header.description}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline">
                  {copy.export}
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button">
              <PlusIcon />
              {copy.addEmployee}
            </Button>
          </>
        }
      />

      {/* Top: Workforce | Distribution + Run Payroll | Attendance */}
      <div className="grid gap-4 xl:grid-cols-12 xl:items-start">
        <Card className="xl:col-span-4">
          <CardHeader className="space-y-3 border-b">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <UsersIcon className="size-4" />
              </div>
              <CardTitle className="text-base font-semibold">{copy.workforce.title}</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-3xl font-bold tabular-nums tracking-tight">
                {copy.workforce.value}
              </p>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {copy.workforce.badge}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 pt-4">
            {copy.workforce.metrics.map((metric) => {
              const Icon = METRIC_ICONS[metric.icon];
              return (
                <StatisticCard
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                  trend={metric.trend}
                  icon={<Icon />}
                  iconClassName={TINT[metric.tint]}
                  className="shadow-none"
                />
              );
            })}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base font-semibold">{copy.distribution.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <DonutChart
                segments={copy.distribution.legend}
                center={
                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {copy.distribution.total}
                  </span>
                }
                showLegend
                aria-label={copy.distribution.title}
              />
              <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
                {copy.distribution.footer.map((item) => (
                  <div key={item.label} className="px-2 py-3 text-center">
                    <p className="text-base font-bold tabular-nums">
                      {item.value}{" "}
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.label}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 rounded-xl bg-primary px-5 py-4 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold">{copy.runPayroll.title}</p>
              <p className="mt-0.5 text-sm text-primary-foreground/90">
                {copy.runPayroll.description}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="bg-white text-primary hover:bg-primary-foreground/90"
            >
              <SettingsIcon />
              {copy.runPayroll.action}
            </Button>
          </div>
        </div>

        <DashboardCard
          className="xl:col-span-4"
          title={copy.attendance.title}
          action={
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto gap-1 px-0 text-primary"
            >
              {copy.viewLogs}
              <ChevronRightIcon className="size-3.5" />
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            {copy.attendance.cells.map((cell) => (
              <div key={cell.label} className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-2xl font-bold tabular-nums">{cell.value}</p>
                <p className="text-xs text-muted-foreground">
                  {cell.label} · {cell.hint}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              {copy.attendance.trendTitle}
            </p>
            <BarChart
              categories={copy.attendance.days}
              series={[{ data: copy.attendance.values, className: "bg-primary" }]}
              highlightIndex={copy.attendance.highlightIndex}
              highlightClassName="bg-primary/40"
              height={128}
              barClassName="w-full max-w-7 rounded-t-md"
              aria-label={copy.attendance.trendTitle}
            />
          </div>
        </DashboardCard>
      </div>

      {/* Mid: Payroll navy + Recruitment — tables live on /table */}
      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="border-0 bg-primary text-primary-foreground shadow-md xl:col-span-7">
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <p className="text-sm text-primary-foreground/80">{copy.payroll.title}</p>
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
                {copy.payroll.value}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="bg-white text-primary hover:bg-primary-foreground/90"
            >
              <DownloadIcon />
              {copy.downloadPayslip}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-white/10 p-3">
              {copy.payroll.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs text-primary-foreground/70">{stat.label}</p>
                  <p className="mt-1 text-base font-semibold tabular-nums">{stat.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-xs text-primary-foreground/70">{copy.payroll.chartLabel}</p>
              <LineChart
                data={copy.payroll.chart}
                stroke="#ffffff"
                aria-label={copy.payroll.chartLabel}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b">
            <CardTitle className="text-base font-semibold">{copy.recruitment.title}</CardTitle>
            <Button type="button" variant="link" size="sm" className="h-auto gap-1 px-0">
              <UserPlusIcon />
              {copy.postJob}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-2">
              {copy.recruitment.stages.map((stage) => (
                <div key={stage.label} className="rounded-xl border border-border p-3 text-center">
                  <div
                    className={`mx-auto mb-2 flex size-9 items-center justify-center rounded-lg ${TINT[stage.tint]}`}
                  >
                    <ClipboardListIcon className="size-4" />
                  </div>
                  <p className="text-lg font-bold tabular-nums">{stage.value}</p>
                  <p className="text-xs leading-tight text-muted-foreground">{stage.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                {copy.recruitment.candidatesTitle}
              </p>
              <ul className="space-y-3">
                {copy.recruitment.candidates.map((candidate) => (
                  <li key={candidate.name} className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback>{initials(candidate.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{candidate.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{candidate.role}</p>
                    </div>
                    <Badge className={STATUS_CLASS[candidate.status]}>{candidate.status}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
