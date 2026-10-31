"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DashboardCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { ChevronRightIcon } from "lucide-react";
import { PIPELINE_PAGE } from "@/constants/pipeline";

const STATUS_CLASS = {
  Interview: "bg-fuchsia-50 text-fuchsia-700 border-transparent",
  Open: "bg-teal-50 text-teal-700 border-transparent",
  Filled: "bg-slate-100 text-slate-700 border-transparent",
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

/** Secondary tables moved from HRM dashboard onto the Table page. */
export function TableSidePanels() {
  const { performance, payments } = PIPELINE_PAGE;

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <DashboardCard
        className="xl:col-span-5"
        title={performance.title}
        action={
          <Button type="button" variant="link" size="sm" className="h-auto gap-1 px-0">
            {performance.action}
            <ChevronRightIcon className="size-3.5" />
          </Button>
        }
      >
        <ul className="space-y-3">
          {performance.rows.map((row) => (
            <li key={row.name} className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{initials(row.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{row.name}</p>
                <p className="truncate text-xs text-muted-foreground">{row.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums">{row.score}</p>
                <p
                  className={`text-xs font-medium ${
                    row.trend.startsWith("-") ? "text-destructive" : "text-success"
                  }`}
                >
                  {row.trend}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </DashboardCard>

      <DashboardCard
        className="xl:col-span-7"
        title={payments.title}
        action={
          <Button type="button" variant="link" size="sm" className="h-auto gap-1 px-0">
            {payments.action}
            <ChevronRightIcon className="size-3.5" />
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {payments.headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.rows.map((row) => (
                <TableRow key={row.title}>
                  <TableCell className="font-semibold">{row.title}</TableCell>
                  <TableCell className="text-muted-foreground">{row.category}</TableCell>
                  <TableCell className="text-muted-foreground">{row.location}</TableCell>
                  <TableCell className="tabular-nums">{row.openings}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_CLASS[row.status]}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </div>
  );
}
