export type MachineStatus = 'ok' | 'due-soon' | 'overdue';

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

/** Determine machine status based on due date */
export function getMachineStatus(nextDue: bigint): MachineStatus {
    const days = daysUntilDue(nextDue);
    if (days <= 0) return 'overdue';
    if (days <= 3) return 'due-soon';
    return 'ok';
}

/** Format a bigint IC time to a readable date string */
export function formatDate(time: bigint): string {
    return timeToDate(time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/** Format a Date to YYYY-MM-DD for input[type=date] */
export function dateToInputValue(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD string to Date (local midnight) */
export function inputValueToDate(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
}

/** Status label text */
export function getStatusLabel(status: MachineStatus, days: number): string {
    if (status === 'overdue') {
        const abs = Math.abs(days);
        return abs === 0 ? 'Due Today' : `Overdue ${abs}d`;
    }
    if (status === 'due-soon') return `Due in ${days}d`;
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
    const intervalMs =
        Number((nextDue - lastCleaningDone) / BigInt(1_000_000));
    const today = new Date();
    return new Date(today.getTime() + intervalMs);
}
