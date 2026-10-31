"use client";

import {
  Avatar,
  AvatarFallback,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldLabel,
  Input,
  RadioGroup,
  RadioGroupItem,
  SortableList,
} from "@erp/miniapp-ui";
import { GripVerticalIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import {
  DEFAULT_PIPELINE_PERSON,
  DEFAULT_PIPELINE_STAGES,
  PIPELINE_PAGE,
  type PipelineAccess,
  type PipelinePerson,
  type PipelineRow,
  type PipelineStage,
} from "@/constants/pipeline";

export type PipelineFormValue = {
  id: string;
  name: string;
  stages: PipelineStage[];
  access: PipelineAccess;
  people: PipelinePerson[];
};

type PipelineFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null` = create mode; row = edit mode. Form syncs on every open. */
  pipeline: PipelineRow | null;
  nextId: string;
  onSubmit: (value: PipelineFormValue) => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function emptyForm(nextId: string): PipelineFormValue {
  return {
    id: nextId,
    name: "",
    stages: DEFAULT_PIPELINE_STAGES.map((s) => ({ ...s })),
    access: "selected",
    people: [{ ...DEFAULT_PIPELINE_PERSON }],
  };
}

function fromPipeline(row: PipelineRow): PipelineFormValue {
  return {
    id: row.id,
    name: row.name,
    stages: row.stages.map((s) => ({ ...s })),
    access: row.access,
    people: row.people.map((p) => ({ ...p })),
  };
}

// Stable ref callback: focuses the stage-name input when it enters edit mode (no `autoFocus`).
const focusOnMount = (el: HTMLInputElement | null) => el?.focus();

export function PipelineFormDialog({
  open,
  onOpenChange,
  pipeline,
  nextId,
  onSubmit,
}: PipelineFormDialogProps) {
  const copy = PIPELINE_PAGE.form;
  const isEdit = pipeline !== null;
  const formId = useId();
  const [form, setForm] = useState<PipelineFormValue>(() => emptyForm(nextId));
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  // Sync form for create + edit whenever the dialog opens (same dialog for all).
  useEffect(() => {
    if (!open) return;
    setForm(pipeline ? fromPipeline(pipeline) : emptyForm(nextId));
    setEditingStageId(null);
  }, [open, pipeline, nextId]);

  function updateStage(id: string, name: string) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === id ? { ...s, name } : s)),
    }));
  }

  function removeStage(id: string) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.filter((s) => s.id !== id),
    }));
    setEditingStageId((curr) => (curr === id ? null : curr));
  }

  function addStage() {
    const id = `s-${Date.now()}`;
    setForm((prev) => ({
      ...prev,
      stages: [...prev.stages, { id, name: "New Stage" }],
    }));
    setEditingStageId(id);
  }

  function removePerson(id: string) {
    setForm((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p.id !== id),
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? copy.editTitle : copy.createTitle}
          </DialogTitle>
        </DialogHeader>

        <form
          id={formId}
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!form.name.trim()) return;
            onSubmit({
              ...form,
              name: form.name.trim(),
              stages: form.stages.map((s) => ({ ...s, name: s.name.trim() || "Untitled" })),
            });
            onOpenChange(false);
          }}
        >
          <Field>
            <FieldLabel htmlFor={`${formId}-id`}>
              {copy.id} <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id={`${formId}-id`} value={form.id} readOnly className="bg-muted" />
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-name`}>
              {copy.name} <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id={`${formId}-name`}
              value={form.name}
              placeholder={copy.namePlaceholder}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </Field>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{copy.stages}</p>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto gap-1 px-0 text-success"
                onClick={addStage}
              >
                <PlusIcon className="size-3.5" />
                {copy.addStage}
              </Button>
            </div>
            <SortableList
              items={form.stages}
              getId={(stage) => stage.id}
              onReorder={(stages) => setForm((prev) => ({ ...prev, stages }))}
              itemClassName="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
              renderItem={(stage, { dragHandleProps }) => (
                <>
                  <span
                    {...dragHandleProps}
                    className={`${dragHandleProps.className ?? ""} inline-flex shrink-0 text-muted-foreground`}
                  >
                    <GripVerticalIcon className="size-4" aria-hidden />
                  </span>
                  {editingStageId === stage.id ? (
                    <Input
                      value={stage.name}
                      ref={focusOnMount}
                      className="h-8 flex-1"
                      placeholder={copy.stagePlaceholder}
                      onChange={(e) => updateStage(stage.id, e.target.value)}
                      onBlur={() => setEditingStageId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setEditingStageId(null);
                        }
                      }}
                    />
                  ) : (
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {stage.name}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 px-2 text-muted-foreground"
                    onClick={() => setEditingStageId(stage.id)}
                  >
                    <PencilIcon className="size-3.5" />
                    {copy.editStage}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 px-2 text-destructive hover:text-destructive"
                    onClick={() => removeStage(stage.id)}
                  >
                    <Trash2Icon className="size-3.5" />
                    {copy.deleteStage}
                  </Button>
                </>
              )}
            />
          </div>

          <Field>
            <FieldLabel>
              {copy.access} <span className="text-destructive">*</span>
            </FieldLabel>
            <RadioGroup
              value={form.access}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  access: value as PipelineAccess,
                  people:
                    value === "selected" && prev.people.length === 0
                      ? [{ ...DEFAULT_PIPELINE_PERSON }]
                      : prev.people,
                }))
              }
              className="flex flex-wrap gap-4"
            >
              <label
                htmlFor={`${formId}-access-all`}
                className="inline-flex items-center gap-2 text-sm"
              >
                <RadioGroupItem value="all" id={`${formId}-access-all`} />
                {copy.accessAll}
              </label>
              <label
                htmlFor={`${formId}-access-selected`}
                className="inline-flex items-center gap-2 text-sm"
              >
                <RadioGroupItem value="selected" id={`${formId}-access-selected`} />
                {copy.accessSelected}
              </label>
            </RadioGroup>
          </Field>

          {form.access === "selected" ? (
            <ul className="space-y-2">
              {form.people.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <Avatar size="sm">
                    <AvatarFallback>{initials(person.name)}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {person.name}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0 text-destructive"
                    onClick={() => removePerson(person.id)}
                  >
                    {copy.removePerson}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </form>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {copy.cancel}
          </Button>
          <Button
            type="submit"
            form={formId}
            className="bg-foreground text-background text-white hover:bg-foreground/90"
          >
            {isEdit ? copy.save : copy.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
