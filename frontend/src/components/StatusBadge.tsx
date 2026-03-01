import { getMachineStatus, daysUntilDue, getStatusLabel } from '../utils/dateUtils';
import type { MachineStatus } from '../utils/dateUtils';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    nextDue: bigint;
    className?: string;
}

const statusStyles: Record<MachineStatus, string> = {
    ok: 'bg-status-ok/15 text-status-ok border border-status-ok/30',
    'due-soon': 'bg-status-warn/15 text-status-warn border border-status-warn/30',
    overdue: 'bg-status-danger/15 text-status-danger border border-status-danger/30',
};

const statusDots: Record<MachineStatus, string> = {
    ok: 'bg-status-ok',
    'due-soon': 'bg-status-warn',
    overdue: 'bg-status-danger animate-pulse',
};

export function StatusBadge({ nextDue, className }: StatusBadgeProps) {
    const status = getMachineStatus(nextDue);
    const days = daysUntilDue(nextDue);
    const label = getStatusLabel(status, days);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
                statusStyles[status],
                className
            )}
        >
            <span className={cn('w-1.5 h-1.5 rounded-full', statusDots[status])} />
            {label}
        </span>
    );
}
