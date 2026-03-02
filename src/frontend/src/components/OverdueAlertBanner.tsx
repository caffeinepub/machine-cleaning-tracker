import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import type { Machine } from "../backend";
import { getMachineStatus } from "../utils/dateUtils";

interface OverdueAlertBannerProps {
  machines: Machine[];
}

export function OverdueAlertBanner({ machines }: OverdueAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const overdueMachines = machines.filter(
    (m) => getMachineStatus(m.nextDue) === "overdue",
  );

  if (overdueMachines.length === 0 || dismissed) return null;

  return (
    <div className="relative flex items-start gap-3 bg-status-danger/10 border border-status-danger/30 rounded-lg px-4 py-3 text-status-danger">
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm uppercase tracking-wide mb-0.5">
          {overdueMachines.length === 1
            ? "1 Machine Cleaning Overdue"
            : `${overdueMachines.length} Machine Cleanings Overdue`}
        </p>
        <p className="text-sm opacity-90">
          {overdueMachines.map((m) => m.name).join(", ")}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
