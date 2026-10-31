"use client";

import {
  Button,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
/**
 * Nested table with rowspan-style cells — from workshop-lines-table.tsx
 */
import Link from "next/link";
import { DETAIL_PAGE } from "@/constants/pages";
import type { MemberRow, TeamDetail } from "@/domain/types";

function formatNumber(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

type FlatRow = {
  key: string;
  member: MemberRow;
  showMember: boolean;
  projectName: string | null;
  projectCode: string | null;
  hours: number | null;
};

function flattenMembers(members: MemberRow[]): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const member of members) {
    if (member.assignments.length === 0) {
      rows.push({
        key: member.id,
        member,
        showMember: true,
        projectName: null,
        projectCode: null,
        hours: null,
      });
      continue;
    }
    member.assignments.forEach((assignment, index) => {
      rows.push({
        key: `${member.id}-${assignment.assignmentId}`,
        member,
        showMember: index === 0,
        projectName: assignment.projectName,
        projectCode: assignment.projectCode,
        hours: assignment.hours,
      });
    });
  }
  return rows;
}

export function EntityMembersTable({ team }: { team: TeamDetail; siteId: string }) {
  if (team.members.length === 0) {
    return <EmptyState {...DETAIL_PAGE.emptyMembers} />;
  }

  const rows = flattenMembers(team.members);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{DETAIL_PAGE.columns.member}</TableHead>
          <TableHead>{DETAIL_PAGE.columns.role}</TableHead>
          <TableHead className="text-right">{DETAIL_PAGE.columns.score}</TableHead>
          <TableHead>{DETAIL_PAGE.columns.project}</TableHead>
          <TableHead>{DETAIL_PAGE.columns.code}</TableHead>
          <TableHead className="text-right">{DETAIL_PAGE.columns.hours}</TableHead>
          <TableHead className="text-right">{DETAIL_PAGE.columns.action}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="font-medium">{row.showMember ? row.member.name : null}</TableCell>
            <TableCell>{row.showMember ? row.member.role : null}</TableCell>
            <TableCell className="text-right tabular-nums">
              {row.showMember ? formatNumber(row.member.score) : null}
            </TableCell>
            <TableCell className="max-w-64 truncate bg-warning/10 font-medium">
              {row.projectName ?? (
                <span className="font-normal text-muted-foreground">
                  {DETAIL_PAGE.noAssignment}
                </span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">{row.projectCode ?? "—"}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(row.hours)}</TableCell>
            <TableCell className="text-right">
              {row.showMember ? (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/requests/new">{DETAIL_PAGE.assignRow}</Link>
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
