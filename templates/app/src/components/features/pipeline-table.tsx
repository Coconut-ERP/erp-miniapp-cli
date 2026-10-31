"use client";

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { PIPELINE_PAGE, type PipelineRow } from "@/constants/pipeline";

type PipelineTableProps = {
  rows: PipelineRow[];
  onEdit: (row: PipelineRow) => void;
  onDelete: (row: PipelineRow) => void;
};

export function PipelineTable({ rows, onEdit, onDelete }: PipelineTableProps) {
  const copy = PIPELINE_PAGE;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{copy.columns.name}</TableHead>
            <TableHead>{copy.columns.stages}</TableHead>
            <TableHead>{copy.columns.deals}</TableHead>
            <TableHead>{copy.columns.totalValue}</TableHead>
            <TableHead>{copy.columns.created}</TableHead>
            <TableHead>{copy.columns.status}</TableHead>
            <TableHead className="text-end">{copy.columns.action}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
              <TableCell className="tabular-nums text-muted-foreground">
                {row.stages.length}
              </TableCell>
              <TableCell className="tabular-nums text-muted-foreground">{row.deals}</TableCell>
              <TableCell className="font-medium tabular-nums">{row.totalValue}</TableCell>
              <TableCell className="text-muted-foreground">{row.created}</TableCell>
              <TableCell>
                <Badge
                  className={
                    row.status === "Active"
                      ? "bg-success/10 text-success hover:bg-success/10"
                      : "bg-destructive/10 text-destructive hover:bg-destructive/10"
                  }
                >
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground"
                    onClick={() => onEdit(row)}
                  >
                    <PencilIcon className="size-3.5" />
                    {copy.actions.edit}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={() => onDelete(row)}
                  >
                    <Trash2Icon className="size-3.5" />
                    {copy.actions.delete}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
