import { useState, useEffect } from 'react';
import type { Machine } from '../backend';
import { useRescheduleNextDue } from '../hooks/useQueries';
import { timeToDate, dateToInputValue, inputValueToDate } from '../utils/dateUtils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, CalendarClock } from 'lucide-react';

interface RescheduleDateModalProps {
    machine: Machine;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RescheduleDateModal({ machine, open, onOpenChange }: RescheduleDateModalProps) {
    const [newDate, setNewDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const reschedule = useRescheduleNextDue();

    useEffect(() => {
        if (open) {
            setNewDate(dateToInputValue(timeToDate(machine.nextDue)));
            setError(null);
        }
    }, [open, machine]);

    const handleSubmit = async () => {
        if (!newDate) {
            setError('Please select a new due date.');
            return;
        }
        setError(null);
        try {
            await reschedule.mutateAsync({
                id: machine.id,
                nextDue: inputValueToDate(newDate),
            });
            onOpenChange(false);
        } catch {
            setError('Failed to reschedule. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-condensed text-xl flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-yellow-500" />
                        Reschedule Machine Part
                    </DialogTitle>
                    <DialogDescription>
                        Set a new next due date for <strong>{machine.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="reschedule-date" className="text-sm font-semibold">
                            New Next Due Date
                        </Label>
                        <Input
                            id="reschedule-date"
                            type="date"
                            value={newDate}
                            onChange={(e) => {
                                setNewDate(e.target.value);
                                setError(null);
                            }}
                            className="w-full"
                        />
                    </div>
                    {error && (
                        <p className="text-xs text-destructive font-medium">{error}</p>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={reschedule.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={reschedule.isPending}
                        className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white border-0"
                    >
                        {reschedule.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Reschedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
