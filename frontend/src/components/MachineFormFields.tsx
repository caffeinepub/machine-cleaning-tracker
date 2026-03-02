import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MachinePart } from '../backend';

export interface MachineFormData {
    name: string;
    lastCleaningDone: string;
    nextDue: string;
    machineNo: string;
    machinePart: MachinePart | '';
}

interface MachineFormFieldsProps {
    data: MachineFormData;
    onChange: (data: MachineFormData) => void;
    error?: string;
}

export const MACHINE_PART_LABELS: Record<MachinePart, string> = {
    [MachinePart.coolantFiltrationUnit]: 'Coolant Filtration Unit',
    [MachinePart.mistUnit]: 'Mist Unit',
    [MachinePart.chillerUnit]: 'Chiller Unit',
};

export function MachineFormFields({ data, onChange, error }: MachineFormFieldsProps) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="machine-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Machine Name
                </Label>
                <Input
                    id="machine-name"
                    placeholder="e.g. CNC Mill #1, Conveyor Belt A"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                    className="font-medium"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="machine-no" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Machine No.
                </Label>
                <Input
                    id="machine-no"
                    placeholder="e.g. MCH-001, A-42"
                    value={data.machineNo}
                    onChange={(e) => onChange({ ...data, machineNo: e.target.value })}
                    className="font-medium"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="machine-part" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Machine Cleaning
                </Label>
                <Select
                    value={data.machinePart}
                    onValueChange={(val) => onChange({ ...data, machinePart: val as MachinePart })}
                >
                    <SelectTrigger id="machine-part" className="font-medium">
                        <SelectValue placeholder="Select a machine cleaning…" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={MachinePart.coolantFiltrationUnit}>
                            Coolant Filtration Unit
                        </SelectItem>
                        <SelectItem value={MachinePart.mistUnit}>
                            Mist Unit
                        </SelectItem>
                        <SelectItem value={MachinePart.chillerUnit}>
                            Chiller Unit
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="last-replaced" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Last Cleaned Date
                </Label>
                <Input
                    id="last-replaced"
                    type="date"
                    max={today}
                    value={data.lastCleaningDone}
                    onChange={(e) => onChange({ ...data, lastCleaningDone: e.target.value })}
                    className="font-medium"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="next-due" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Next Due Date
                </Label>
                <Input
                    id="next-due"
                    type="date"
                    value={data.nextDue}
                    onChange={(e) => onChange({ ...data, nextDue: e.target.value })}
                    className="font-medium"
                />
            </div>

            {error && (
                <p className="text-sm text-destructive font-medium bg-destructive/10 px-3 py-2 rounded-md">
                    {error}
                </p>
            )}
        </div>
    );
}

export function validateMachineForm(data: MachineFormData): string | null {
    if (!data.name.trim()) return 'Machine name is required.';
    if (!data.machinePart) return 'Machine cleaning is required.';
    if (!data.lastCleaningDone) return 'Last cleaned date is required.';
    if (!data.nextDue) return 'Next due date is required.';
    if (data.nextDue < data.lastCleaningDone) return 'Next due date cannot be before the last cleaned date.';
    return null;
}
