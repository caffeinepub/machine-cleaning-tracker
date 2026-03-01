import { useState } from 'react';
import { useAddMachine } from '../hooks/useQueries';
import { inputValueToDate } from '../utils/dateUtils';
import { MachineFormFields, validateMachineForm } from './MachineFormFields';
import type { MachineFormData } from './MachineFormFields';
import { MachinePart } from '../backend';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';

interface AddMachineModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const emptyForm: MachineFormData = {
    name: '',
    lastCleaningDone: '',
    nextDue: '',
    machineNo: '',
    machinePart: '',
};

export function AddMachineModal({ open, onOpenChange }: AddMachineModalProps) {
    const [form, setForm] = useState<MachineFormData>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const addMachine = useAddMachine();

    const handleSubmit = async () => {
        const error = validateMachineForm(form);
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);

        const id = `machine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        try {
            await addMachine.mutateAsync({
                id,
                name: form.name.trim(),
                lastCleaningDone: inputValueToDate(form.lastCleaningDone),
                nextDue: inputValueToDate(form.nextDue),
                machineNo: form.machineNo.trim() || null,
                machinePart: form.machinePart as MachinePart,
            });
            setForm(emptyForm);
            onOpenChange(false);
        } catch {
            setFormError('Failed to add machine. Please try again.');
        }
    };

    const handleOpenChange = (val: boolean) => {
        if (!val) {
            setForm(emptyForm);
            setFormError(null);
        }
        onOpenChange(val);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-condensed text-xl flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-primary" />
                        Add New Machine
                    </DialogTitle>
                    <DialogDescription>
                        Register a machine with its details, last replaced date and next scheduled due date.
                    </DialogDescription>
                </DialogHeader>

                <MachineFormFields
                    data={form}
                    onChange={(d) => { setForm(d); setFormError(null); }}
                    error={formError ?? undefined}
                />

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={addMachine.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={addMachine.isPending} className="gap-2">
                        {addMachine.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Add Machine
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
