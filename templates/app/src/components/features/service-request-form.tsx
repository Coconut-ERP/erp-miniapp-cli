"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Textarea,
} from "@erp/miniapp-ui";
import { useRouter } from "next/navigation";
/**
 * Multi-step form template — field types, validation, conditional fields, review step.
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FORM_PAGE } from "@/constants/pages";
import type {
  RequestPriority,
  RequestType,
  ServiceRequestFormOptions,
  ServiceRequestInput,
} from "@/domain/types";
import { useSubmitServiceRequest } from "@/hooks/use-service-requests";
import { addDaysLocal, todayLocal } from "@/lib/date";

type Step = "basics" | "schedule" | "options" | "review";

type FormState = {
  requestType: RequestType | "";
  title: string;
  description: string;
  departmentId: string;
  priority: RequestPriority;
  startDate: string;
  endDate: string;
  urgent: boolean;
  severity: ServiceRequestInput["severity"] | "";
  notifyIds: string[];
  referenceId: string;
  acceptPolicy: boolean;
};

type FormErrors = Partial<Record<keyof FormState | "form", string>>;

const STEPS: Step[] = ["basics", "schedule", "options", "review"];

function initialState(): FormState {
  const start = todayLocal();
  return {
    requestType: "",
    title: "",
    description: "",
    departmentId: "",
    priority: "normal",
    startDate: start,
    endDate: addDaysLocal(start, 7),
    urgent: false,
    severity: "",
    notifyIds: ["owner"],
    referenceId: "",
    acceptPolicy: false,
  };
}

function validateStep(step: Step, state: FormState): FormErrors {
  const errors: FormErrors = {};

  if (step === "basics") {
    if (!state.requestType) errors.requestType = FORM_PAGE.errors.requestType;
    if (state.title.trim().length < 3) errors.title = FORM_PAGE.errors.title;
    if (!state.departmentId) errors.departmentId = FORM_PAGE.errors.department;
    if (state.requestType === "incident" && state.description.trim().length < 10) {
      errors.description = FORM_PAGE.errors.incidentDescription;
    } else if (state.description.trim().length < 5) {
      errors.description = FORM_PAGE.errors.description;
    }
  }

  if (step === "schedule") {
    if (state.endDate < state.startDate) errors.endDate = FORM_PAGE.errors.endDate;
  }

  if (step === "options") {
    if (state.requestType === "incident" && !state.severity) {
      errors.severity = FORM_PAGE.errors.severity;
    }
    if (!state.acceptPolicy) errors.acceptPolicy = FORM_PAGE.errors.acceptPolicy;
  }

  return errors;
}

function stepIndex(step: Step): number {
  return STEPS.indexOf(step);
}

function labelForType(options: ServiceRequestFormOptions, id: RequestType | "") {
  return options.requestTypes.find((t) => t.id === id)?.label ?? "—";
}

function labelForDepartment(options: ServiceRequestFormOptions, id: string) {
  return options.departments.find((d) => d.id === id)?.label ?? "—";
}

export function ServiceRequestForm({ options }: { options: ServiceRequestFormOptions }) {
  const router = useRouter();
  const submit = useSubmitServiceRequest();
  const [step, setStep] = useState<Step>("basics");
  const [state, setState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attemptedReview, setAttemptedReview] = useState(false);

  const isIncident = state.requestType === "incident";
  const currentIndex = stepIndex(step);

  const reviewPayload = useMemo((): ServiceRequestInput | null => {
    if (!state.requestType || !state.departmentId) return null;
    if (isIncident && !state.severity) return null;
    return {
      requestType: state.requestType,
      title: state.title.trim(),
      description: state.description.trim(),
      departmentId: state.departmentId,
      priority: state.priority,
      startDate: state.startDate,
      endDate: state.endDate,
      urgent: state.urgent,
      severity: isIncident && state.severity ? state.severity : null,
      notifyIds: state.notifyIds,
      referenceId: state.referenceId.trim(),
      acceptPolicy: state.acceptPolicy,
    };
  }, [isIncident, state]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function toggleNotify(id: string, checked: boolean) {
    setState((prev) => ({
      ...prev,
      notifyIds: checked
        ? [...new Set([...prev.notifyIds, id])]
        : prev.notifyIds.filter((n) => n !== id),
    }));
  }

  function goNext() {
    const nextErrors = validateStep(step, state);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    const next = STEPS[currentIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    setErrors({});
    const prev = STEPS[currentIndex - 1];
    if (prev) setStep(prev);
  }

  function goToStep(target: Step) {
    const targetIdx = stepIndex(target);
    if (targetIdx === currentIndex) return;

    if (targetIdx < currentIndex) {
      setErrors({});
      setStep(target);
      return;
    }

    for (let i = currentIndex; i < targetIdx; i++) {
      const step = STEPS[i];
      if (!step) continue;
      const stepErrors = validateStep(step, state);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setStep(step);
        return;
      }
    }

    setErrors({});
    setStep(target);
  }

  async function onSubmit() {
    setAttemptedReview(true);
    const optionErrors = validateStep("options", state);
    const scheduleErrors = validateStep("schedule", state);
    const basicsErrors = validateStep("basics", state);
    const merged = { ...basicsErrors, ...scheduleErrors, ...optionErrors };
    if (Object.keys(merged).length > 0) {
      setErrors(merged);
      toast.error(FORM_PAGE.toastFixErrors);
      if (merged.requestType || merged.title || merged.description || merged.departmentId) {
        setStep("basics");
      } else if (merged.endDate) {
        setStep("schedule");
      } else {
        setStep("options");
      }
      return;
    }

    if (!reviewPayload) return;

    try {
      const result = await submit.mutateAsync(reviewPayload);
      toast.success(FORM_PAGE.toastSuccess(result.reference));
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : FORM_PAGE.toastFailure);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <nav aria-label={FORM_PAGE.stepNavLabel}>
        <ol className="flex flex-wrap gap-2">
          {STEPS.map((s, index) => {
            const active = s === step;
            const done = index < currentIndex;
            return (
              <li key={s}>
                <Button
                  type="button"
                  size="sm"
                  variant={active ? "default" : done ? "secondary" : "outline"}
                  aria-current={active ? "step" : undefined}
                  onClick={() => goToStep(s)}
                >
                  {index + 1}. {FORM_PAGE.steps[s]}
                </Button>
              </li>
            );
          })}
        </ol>
      </nav>

      {step === "basics" ? (
        <Card>
          <CardHeader>
            <CardTitle>{FORM_PAGE.sections.basics.title}</CardTitle>
            <CardDescription>{FORM_PAGE.sections.basics.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>{FORM_PAGE.sections.basics.legend}</FieldLegend>
                <Field data-invalid={!!errors.requestType}>
                  <FieldLabel>{FORM_PAGE.labels.requestType}</FieldLabel>
                  <Select
                    value={state.requestType || undefined}
                    onValueChange={(v) => patch("requestType", v as RequestType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={FORM_PAGE.placeholders.requestType} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.requestTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {`${type.label} — ${type.hint}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.requestType}</FieldError>
                </Field>

                <Field data-invalid={!!errors.title}>
                  <FieldLabel htmlFor="sr-title">{FORM_PAGE.labels.title}</FieldLabel>
                  <Input
                    id="sr-title"
                    value={state.title}
                    onChange={(e) => patch("title", e.target.value)}
                    placeholder={FORM_PAGE.placeholders.title}
                  />
                  <FieldDescription>{FORM_PAGE.hints.title}</FieldDescription>
                  <FieldError>{errors.title}</FieldError>
                </Field>

                <Field data-invalid={!!errors.description}>
                  <FieldLabel htmlFor="sr-description">{FORM_PAGE.labels.description}</FieldLabel>
                  <Textarea
                    id="sr-description"
                    rows={4}
                    value={state.description}
                    onChange={(e) => patch("description", e.target.value)}
                    placeholder={FORM_PAGE.placeholders.description}
                  />
                  <FieldDescription>
                    {isIncident ? FORM_PAGE.hints.incidentDescription : FORM_PAGE.hints.description}
                  </FieldDescription>
                  <FieldError>{errors.description}</FieldError>
                </Field>

                <Field data-invalid={!!errors.departmentId}>
                  <FieldLabel>{FORM_PAGE.labels.department}</FieldLabel>
                  <Select
                    value={state.departmentId || undefined}
                    onValueChange={(v) => patch("departmentId", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={FORM_PAGE.placeholders.department} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.departmentId}</FieldError>
                </Field>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t border-border/60">
            <Button type="button" onClick={goNext}>
              {FORM_PAGE.actions.continue}
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      {step === "schedule" ? (
        <Card>
          <CardHeader>
            <CardTitle>{FORM_PAGE.sections.schedule.title}</CardTitle>
            <CardDescription>{FORM_PAGE.sections.schedule.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldSet>
              <FieldLegend>{FORM_PAGE.labels.priority}</FieldLegend>
              <RadioGroup
                value={state.priority}
                onValueChange={(v) => patch("priority", v as RequestPriority)}
                className="grid gap-2 sm:grid-cols-2"
              >
                {FORM_PAGE.priorityOptions.map((opt) => (
                  <Field key={opt.id} orientation="horizontal">
                    <RadioGroupItem value={opt.id} id={`priority-${opt.id}`} />
                    <FieldLabel htmlFor={`priority-${opt.id}`} className="font-normal">
                      {opt.label}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
            </FieldSet>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="sr-start">{FORM_PAGE.labels.startDate}</FieldLabel>
                <Input
                  id="sr-start"
                  type="date"
                  value={state.startDate}
                  onChange={(e) => patch("startDate", e.target.value)}
                />
              </Field>
              <Field data-invalid={!!errors.endDate}>
                <FieldLabel htmlFor="sr-end">{FORM_PAGE.labels.endDate}</FieldLabel>
                <Input
                  id="sr-end"
                  type="date"
                  value={state.endDate}
                  min={state.startDate}
                  onChange={(e) => patch("endDate", e.target.value)}
                />
                <FieldError>{errors.endDate}</FieldError>
              </Field>
            </div>

            <Field orientation="horizontal" className="rounded-lg border border-border/60 p-4">
              <FieldContent>
                <FieldLabel htmlFor="sr-urgent">{FORM_PAGE.labels.urgent}</FieldLabel>
                <FieldDescription>{FORM_PAGE.hints.urgent}</FieldDescription>
              </FieldContent>
              <Switch
                id="sr-urgent"
                checked={state.urgent}
                onCheckedChange={(v) => patch("urgent", v)}
              />
            </Field>
          </CardContent>
          <CardFooter className="justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" onClick={goBack}>
              {FORM_PAGE.actions.back}
            </Button>
            <Button type="button" onClick={goNext}>
              {FORM_PAGE.actions.continue}
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      {step === "options" ? (
        <Card>
          <CardHeader>
            <CardTitle>{FORM_PAGE.sections.options.title}</CardTitle>
            <CardDescription>{FORM_PAGE.sections.options.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isIncident ? (
              <Field data-invalid={!!errors.severity}>
                <FieldLabel>{FORM_PAGE.labels.severity}</FieldLabel>
                <Select
                  value={state.severity || undefined}
                  onValueChange={(v) => patch("severity", v as ServiceRequestInput["severity"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={FORM_PAGE.placeholders.severity} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.severities.map((sev) => (
                      <SelectItem key={sev.id} value={sev.id}>
                        {sev.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.severity}</FieldError>
              </Field>
            ) : null}

            <FieldSet>
              <FieldLegend>{FORM_PAGE.labels.notify}</FieldLegend>
              <FieldDescription>{FORM_PAGE.hints.notify}</FieldDescription>
              <div className="mt-3 space-y-2">
                {options.notifyOptions.map((opt) => (
                  <Field key={opt.id} orientation="horizontal">
                    <Checkbox
                      id={`notify-${opt.id}`}
                      checked={state.notifyIds.includes(opt.id)}
                      onCheckedChange={(checked) => toggleNotify(opt.id, checked === true)}
                    />
                    <FieldLabel htmlFor={`notify-${opt.id}`} className="font-normal">
                      {opt.label}
                    </FieldLabel>
                  </Field>
                ))}
              </div>
            </FieldSet>

            <Accordion
              type="single"
              collapsible
              className="rounded-lg border border-border/60 px-4"
            >
              <AccordionItem value="advanced">
                <AccordionTrigger>{FORM_PAGE.sections.advanced.title}</AccordionTrigger>
                <AccordionContent>
                  <Field>
                    <FieldLabel htmlFor="sr-ref">{FORM_PAGE.labels.referenceId}</FieldLabel>
                    <Input
                      id="sr-ref"
                      value={state.referenceId}
                      onChange={(e) => patch("referenceId", e.target.value)}
                      placeholder={FORM_PAGE.placeholders.referenceId}
                    />
                    <FieldDescription>{FORM_PAGE.hints.referenceId}</FieldDescription>
                  </Field>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Field data-invalid={!!errors.acceptPolicy} orientation="horizontal">
              <Checkbox
                id="sr-policy"
                checked={state.acceptPolicy}
                onCheckedChange={(checked) => patch("acceptPolicy", checked === true)}
              />
              <FieldContent>
                <FieldLabel htmlFor="sr-policy" className="font-normal">
                  {FORM_PAGE.labels.acceptPolicy}
                </FieldLabel>
                <FieldError>{errors.acceptPolicy}</FieldError>
              </FieldContent>
            </Field>
          </CardContent>
          <CardFooter className="justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" onClick={goBack}>
              {FORM_PAGE.actions.back}
            </Button>
            <Button type="button" onClick={goNext}>
              {FORM_PAGE.actions.review}
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      {step === "review" ? (
        <Card>
          <CardHeader>
            <CardTitle>{FORM_PAGE.sections.review.title}</CardTitle>
            <CardDescription>{FORM_PAGE.sections.review.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {attemptedReview && Object.keys(errors).length > 0 ? (
              <Alert variant="destructive">
                <AlertTitle>{FORM_PAGE.reviewErrorTitle}</AlertTitle>
                <AlertDescription>{FORM_PAGE.toastFixErrors}</AlertDescription>
              </Alert>
            ) : null}

            <dl className="divide-y divide-border/60 text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-muted-foreground">{FORM_PAGE.labels.requestType}</dt>
                <dd className="sm:col-span-2 font-medium">
                  {labelForType(options, state.requestType)}
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-muted-foreground">{FORM_PAGE.labels.title}</dt>
                <dd className="sm:col-span-2 font-medium">{state.title || "—"}</dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-muted-foreground">{FORM_PAGE.labels.department}</dt>
                <dd className="sm:col-span-2 font-medium">
                  {labelForDepartment(options, state.departmentId)}
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-muted-foreground">{FORM_PAGE.labels.priority}</dt>
                <dd className="sm:col-span-2 capitalize">{state.priority}</dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-muted-foreground">{FORM_PAGE.labels.window}</dt>
                <dd className="sm:col-span-2 tabular-nums">
                  {state.startDate} → {state.endDate}
                  {state.urgent ? (
                    <Badge variant="destructive" className="ml-2">
                      {FORM_PAGE.badges.urgent}
                    </Badge>
                  ) : null}
                </dd>
              </div>
              {isIncident && state.severity ? (
                <div className="grid gap-1 py-3 sm:grid-cols-3">
                  <dt className="text-muted-foreground">{FORM_PAGE.labels.severity}</dt>
                  <dd className="sm:col-span-2 capitalize">{state.severity}</dd>
                </div>
              ) : null}
              <div className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-muted-foreground">{FORM_PAGE.labels.notify}</dt>
                <dd className="sm:col-span-2">
                  {state.notifyIds.length === 0
                    ? "—"
                    : state.notifyIds
                        .map((id) => options.notifyOptions.find((n) => n.id === id)?.label ?? id)
                        .join(", ")}
                </dd>
              </div>
            </dl>

            <Separator />

            <p className="text-sm text-muted-foreground">{state.description || "—"}</p>
          </CardContent>
          <CardFooter className="justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" onClick={goBack}>
              {FORM_PAGE.actions.back}
            </Button>
            <Button type="button" disabled={submit.isPending} onClick={() => void onSubmit()}>
              {submit.isPending ? FORM_PAGE.actions.submitting : FORM_PAGE.actions.submit}
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  );
}
