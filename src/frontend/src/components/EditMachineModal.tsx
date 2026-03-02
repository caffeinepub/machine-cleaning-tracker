import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { Machine } from "../backend";
import type { MachinePart } from "../backend";
import { useUpdateMachine } from "../hooks/useQueries";
import {
  dateToInputValue,
  inputValueToDate,
  timeToDate,
} from "../utils/dateUtils";
import { MachineFormFields, validateMachineForm } from "./MachineFormFields";
import type { MachineFormData } from "./MachineFormFields";

interface EditMachineModalProps {
  machine: Machine;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMachineModal({
  machine,
  open,
  onOpenChange,
}: EditMachineModalProps) {
  const [form, setForm] = useState<MachineFormData>({
    name: "",
    lastCleaningDone: "",
    nextDue: "",
    machineNo: "",
    machinePart: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const updateMachine = useUpdateMachine();

  useEffect(() => {
    if (open) {
      setForm({
        name: machine.name,
        lastCleaningDone: dateToInputValue(
          timeToDate(machine.lastCleaningDone),
        ),
        nextDue: dateToInputValue(timeToDate(machine.nextDue)),
        machineNo: machine.machineNo ?? "",
        machinePart: machine.machinePart ?? "",
      });
      setFormError(null);
    }
  }, [open, machine]);

  const handleSubmit = async () => {
    const error = validateMachineForm(form);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);

    try {
      await updateMachine.mutateAsync({
        id: machine.id,
        name: form.name.trim(),
        lastCleaningDone: inputValueToDate(form.lastCleaningDone),
        nextDue: inputValueToDate(form.nextDue),
        machineNo: form.machineNo.trim() || null,
        machinePart: form.machinePart as MachinePart,
      });
      onOpenChange(false);
    } catch {
      setFormError("Failed to update machine. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-condensed text-xl flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Machine
          </DialogTitle>
          <DialogDescription>
            Update the details for <strong>{machine.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <MachineFormFields
          data={form}
          onChange={(d) => {
            setForm(d);
            setFormError(null);
          }}
          error={formError ?? undefined}
        />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMachine.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateMachine.isPending}
            className="gap-2"
          >
            {updateMachine.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
