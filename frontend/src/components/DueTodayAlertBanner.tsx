import { useState } from 'react';
import type { Machine } from '../backend';
import { Bell, X } from 'lucide-react';

interface DueTodayAlertBannerProps {
    machines: Machine[];
}

export function DueTodayAlertBanner({ machines }: DueTodayAlertBannerProps) {
    const [dismissed, setDismissed] = useState(false);

    if (machines.length === 0 || dismissed) return null;

    return (
        <div className="relative flex items-start gap-3 rounded-lg px-4 py-3 text-white animate-flash-banner due-today-banner overflow-hidden">
            {/* Animated background overlay for flash effect */}
            <div className="absolute inset-0 bg-due-today animate-flash-bg pointer-events-none rounded-lg" />

            {/* Content */}
            <div className="relative z-10 flex items-start gap-3 w-full">
                <div className="flex-shrink-0 mt-0.5">
                    <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
                        {machines.length === 1
                            ? '⚠ URGENT: 1 Machine Part Due Within 24 Hours!'
                            : `⚠ URGENT: ${machines.length} Machine Parts Due Within 24 Hours!`}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {machines.map((m) => (
                            <span
                                key={m.id}
                                className="inline-flex items-center gap-1 bg-white/20 border border-white/30 rounded px-2 py-0.5 text-xs font-semibold"
                            >
                                {m.name}
                                {m.machineNo && (
                                    <span className="opacity-80">#{m.machineNo}</span>
                                )}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs mt-1.5 opacity-80 font-medium">
                        Immediate attention required — replace the machine part today.
                    </p>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="relative z-10 flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity p-0.5 rounded"
                    aria-label="Dismiss alert"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
