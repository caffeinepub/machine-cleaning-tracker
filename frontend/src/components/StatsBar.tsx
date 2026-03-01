import type { Machine } from '../backend';
import { getMachineStatus } from '../utils/dateUtils';
import { CheckCircle2, AlertCircle, XCircle, Wrench, Bell } from 'lucide-react';

interface StatsBarProps {
    machines: Machine[];
}

export function StatsBar({ machines }: StatsBarProps) {
    const total = machines.length;
    const ok = machines.filter((m) => getMachineStatus(m.nextDue) === 'ok').length;
    const dueSoon = machines.filter((m) => getMachineStatus(m.nextDue) === 'due-soon').length;
    const dueToday = machines.filter((m) => getMachineStatus(m.nextDue) === 'due-today').length;
    const overdue = machines.filter((m) => getMachineStatus(m.nextDue) === 'overdue').length;

    const stats = [
        { label: 'Total Machines', value: total, icon: Wrench, color: 'text-foreground', bg: 'bg-muted' },
        { label: 'On Schedule', value: ok, icon: CheckCircle2, color: 'text-status-ok', bg: 'bg-status-ok/10' },
        { label: 'Due Soon', value: dueSoon, icon: AlertCircle, color: 'text-status-warn', bg: 'bg-status-warn/10' },
        {
            label: 'Due Today',
            value: dueToday,
            icon: Bell,
            color: 'text-due-today',
            bg: 'bg-due-today/10',
            pulse: dueToday > 0,
        },
        { label: 'Part Overdue', value: overdue, icon: XCircle, color: 'text-status-danger', bg: 'bg-status-danger/10' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {stats.map(({ label, value, icon: Icon, color, bg, pulse }) => (
                <div
                    key={label}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 ${bg} ${pulse ? 'ring-1 ring-due-today/50 animate-pulse-card-red' : ''}`}
                >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${color} ${pulse ? 'animate-bounce' : ''}`} />
                    <div>
                        <p className={`text-xl font-condensed font-bold leading-none ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
