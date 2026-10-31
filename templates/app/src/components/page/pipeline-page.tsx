"use client";

import {
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  FormStack,
  PageHeader,
} from "@erp/miniapp-ui";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  PipelineFormDialog,
  type PipelineFormValue,
} from "@/components/features/pipeline-form-dialog";
import { PipelineTable } from "@/components/features/pipeline-table";
import { TableSidePanels } from "@/components/features/table-side-panels";
import { PIPELINE_PAGE, PIPELINE_SEED, type PipelineRow } from "@/constants/pipeline";

function nextPipelineId(rows: PipelineRow[]) {
  const nums = rows.map((r) => Number(r.id.replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 20;
  return `#PIP${String(max + 1).padStart(4, "0")}`;
}

export function TablePage() {
  const copy = PIPELINE_PAGE;
  const [rows, setRows] = useState<PipelineRow[]>(PIPELINE_SEED);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PipelineRow | null>(null);
  const [deleting, setDeleting] = useState<PipelineRow | null>(null);

  const nextId = useMemo(() => nextPipelineId(rows), [rows]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(row: PipelineRow) {
    setEditing(row);
    setFormOpen(true);
  }

  function handleSubmit(value: PipelineFormValue) {
    if (editing) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editing.id
            ? {
                ...row,
                name: value.name,
                stages: value.stages,
                access: value.access,
                people: value.access === "selected" ? value.people : [],
              }
            : row,
        ),
      );
      toast.success(copy.toast.updated);
      return;
    }

    const created: PipelineRow = {
      id: value.id,
      name: value.name,
      stages: value.stages,
      deals: 0,
      totalValue: "$0",
      created: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Active",
      access: value.access,
      people: value.access === "selected" ? value.people : [],
    };
    setRows((prev) => [created, ...prev]);
    toast.success(copy.toast.created);
  }

  return (
    <FormStack className="gap-4">
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
                <DropdownMenuItem>{copy.exportPdf}</DropdownMenuItem>
                <DropdownMenuItem>{copy.exportExcel}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              type="button"
              className="bg-foreground text-background text-white hover:bg-foreground/90"
              onClick={openCreate}
            >
              <PlusIcon />
              {copy.add}
            </Button>
          </>
        }
      />

      {rows.length === 0 ? (
        <EmptyState title={copy.empty.title} description={copy.empty.description} />
      ) : (
        <PipelineTable rows={rows} onEdit={openEdit} onDelete={setDeleting} />
      )}

      <TableSidePanels />

      <PipelineFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        pipeline={editing}
        nextId={nextId}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={copy.delete.title}
        description={copy.delete.description}
        confirmLabel={copy.delete.confirm}
        cancelLabel={copy.delete.cancel}
        destructive
        onConfirm={() => {
          if (!deleting) return;
          setRows((prev) => prev.filter((row) => row.id !== deleting.id));
          toast.success(copy.toast.deleted);
          setDeleting(null);
        }}
      />
    </FormStack>
  );
}
