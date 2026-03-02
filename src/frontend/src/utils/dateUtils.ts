export type MachineStatus = "ok" | "due-soon" | "due-today" | "overdue";

/** Convert IC Time (bigint nanoseconds) to JS Date */
export function timeToDate(time: bigint): Date {
  return new Date(Number(time / BigInt(1_000_000)));
}

/** Convert JS Date to IC Time (bigint nanoseconds) */
export function dateToTime(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

/** Get days until due date (negative = overdue) */
export function daysUntilDue(nextDue: bigint): number {
  const now = new Date();
  const dueDate = timeToDate(nextDue);
  const diffMs = dueDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Get milliseconds until due date */
export function msUntilDue(nextDue: bigint): number {
  const now = new Date();
  const dueDate = timeToDate(nextDue);
  return dueDate.getTime() - now.getTime();
}

/**
 * Determine machine status based on due date.
 * Priority: overdue > due-today (≤24h) > due-soon (≤7 days) > ok
 */
export function getMachineStatus(nextDue: bigint): MachineStatus {
  const ms = msUntilDue(nextDue);
  if (ms <= 0) return "overdue";
  if (ms <= 86_400_000) return "due-today"; // within 24 hours
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days <= 3) return "due-soon";
  return "ok";
}

/** Format a bigint IC time to a readable date string */
export function formatDate(time: bigint): string {
  return timeToDate(time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format a bigint IC time to a readable date+time string */
export function formatDateTime(time: bigint): string {
  return timeToDate(time).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Format a Date to YYYY-MM-DD for input[type=date] */
export function dateToInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD string to Date (local midnight) */
export function inputValueToDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Status label text */
export function getStatusLabel(status: MachineStatus, days: number): string {
  if (status === "overdue") {
    const abs = Math.abs(days);
    return abs === 0 ? "Due Today" : `Overdue ${abs}d`;
  }
  if (status === "due-today") return "Due in <1 Day!";
  if (status === "due-soon") return `Due in ${days}d`;
  return `${days}d left`;
}

/**
 * Calculate the next due date from today, preserving the original part replacement interval.
 * The interval is derived from the difference between lastCleaningDone and nextDue.
 */
export function calculateNextDueFromToday(
  lastCleaningDone: bigint,
  nextDue: bigint,
): Date {
  const intervalMs = Number((nextDue - lastCleaningDone) / BigInt(1_000_000));
  const today = new Date();
  return new Date(today.getTime() + intervalMs);
}

/**
 * Format a Uint8Array userId (principal bytes) as a short truncated string for display.
 * Shows first 5 and last 3 hex chars with ellipsis in between.
 */
export function formatPrincipalShort(userId: Uint8Array): string {
  if (!userId || userId.length === 0) return "unknown";
  const hex = Array.from(userId)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (hex.length <= 10) return hex;
  return `${hex.slice(0, 6)}…${hex.slice(-4)}`;
}
