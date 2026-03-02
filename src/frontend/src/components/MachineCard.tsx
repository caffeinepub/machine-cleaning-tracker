import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Hash,
  Loader2,
  Pencil,
  Settings2,
  Trash2,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import type { Machine } from "../backend";
import { MachinePart } from "../backend";
import { useMarkPartDone } from "../hooks/useQueries";
import { formatDate, getMachineStatus } from "../utils/dateUtils";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { EditMachineModal } from "./EditMachineModal";
import { RescheduleDateModal } from "./RescheduleDateModal";
import { StatusBadge } from "./StatusBadge";

interface MachineCardProps {
  machine: Machine;
}

const MACHINE_PART_LABELS: Record<MachinePart, string> = {
  [MachinePart.coolantFiltrationUnit]: "Coolant Filtration Unit",
  [MachinePart.mistUnit]: "Mist Unit",
  [MachinePart.chillerUnit]: "Chiller Unit",
};

export function MachineCard({ machine }: MachineCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [partDone, setPartDone] = useState(false);

  const markPartDone = useMarkPartDone();
  const status = getMachineStatus(machine.nextDue);
  const isDueToday = status === "due-today";

  const handlePartDone = async () => {
    try {
      await markPartDone.mutateAsync(machine);
      setPartDone(true);
    } catch {
      // error handled silently; button stays in default state
    }
  };

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden border shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5",
          isDueToday
            ? "border-due-today bg-due-today/5 animate-pulse-card-red"
            : "border-border",
        )}
      >
        {/* Accent bar on left — dark red for due-today, orange otherwise */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 rounded-l",
            isDueToday ? "bg-due-today" : "bg-primary",
          )}
        />

        <CardHeader className="pb-2 pl-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center",
                  isDueToday ? "bg-due-today/15" : "bg-primary/10",
                )}
              >
                <Wrench
                  className={cn(
                    "w-4 h-4",
                    isDueToday ? "text-due-today" : "text-primary",
                  )}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-condensed text-lg font-bold text-foreground truncate leading-tight">
                  {machine.name}
                </h3>
                {machine.machineNo && (
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                    <Hash className="w-3 h-3" />
                    {machine.machineNo}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge
              nextDue={machine.nextDue}
              className="flex-shrink-0 mt-0.5"
            />
          </div>
        </CardHeader>

        <CardContent className="pl-5 pb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-start gap-2">
              <CalendarCheck className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">
                  Last Cleaned
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(machine.lastCleaningDone)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarClock
                className={cn(
                  "w-4 h-4 mt-0.5 flex-shrink-0",
                  isDueToday ? "text-due-today" : "text-muted-foreground",
                )}
              />
              <div>
                <p
                  className={cn(
                    "text-xs uppercase tracking-wide font-semibold mb-0.5",
                    isDueToday ? "text-due-today" : "text-muted-foreground",
                  )}
                >
                  Next Due
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isDueToday ? "text-due-today font-bold" : "text-foreground",
                  )}
                >
                  {formatDate(machine.nextDue)}
                </p>
              </div>
            </div>
          </div>

          {machine.machinePart && (
            <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-md bg-muted/50">
              <Settings2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mr-1.5">
                  Machine Cleaning:
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {MACHINE_PART_LABELS[machine.machinePart] ??
                    machine.machinePart}
                </span>
              </div>
            </div>
          )}

          {/* Edit / Delete row */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs font-semibold gap-1.5"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="w-3 h-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs font-semibold gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>

          {/* Cleaning Done / Reschedule row */}
          <div className="flex items-center gap-2 pt-2 mt-1">
            <Button
              size="sm"
              className={[
                "flex-1 h-8 text-xs font-semibold gap-1.5 border-0 transition-colors duration-300",
                partDone
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-600/20 hover:bg-green-600 text-green-700 hover:text-white border border-green-600/40",
              ].join(" ")}
              onClick={handlePartDone}
              disabled={markPartDone.isPending || partDone}
            >
              {markPartDone.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3 h-3" />
              )}
              {partDone ? "Done ✓" : "Cleaning Done"}
            </Button>
            <Button
              size="sm"
              className="flex-1 h-8 text-xs font-semibold gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white border-0"
              onClick={() => setRescheduleOpen(true)}
              disabled={markPartDone.isPending}
            >
              <CalendarClock className="w-3 h-3" />
              Reschedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditMachineModal
        machine={machine}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteConfirmDialog
        machine={machine}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
      <RescheduleDateModal
        machine={machine}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
      />
    </>
  );
}
