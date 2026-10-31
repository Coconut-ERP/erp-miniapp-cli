export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Local calendar day for `<input type="date">`. */
export function todayLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

/** Compare ERP date values that may be full ISO timestamps. */
export function sameDay(value: unknown, day: string): boolean {
  if (value == null) return false;
  return String(value).slice(0, 10) === day;
}

export function addDaysLocal(from: string, days: number): string {
  const d = new Date(`${from}T12:00:00`);
  d.setDate(d.getDate() + days);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 10);
}
