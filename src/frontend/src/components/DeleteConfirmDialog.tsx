import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import type { Machine } from "../backend";
import { useDeleteMachine } from "../hooks/useQueries";

interface DeleteConfirmDialogProps {
  machine: Machine;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmDialog({
  machine,
  open,
  onOpenChange,
}: DeleteConfirmDialogProps) {
  const deleteMachine = useDeleteMachine();

  const handleDelete = async () => {
    try {
      await deleteMachine.mutateAsync(machine.id);
      onOpenChange(false);
    } catch {
      // error handled silently; dialog stays open
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-condensed text-xl">
            Delete Machine?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{machine.name}</strong>? This
            action cannot be undone and all cleaning history will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMachine.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMachine.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
          >
            {deleteMachine.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Delete Machine
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
