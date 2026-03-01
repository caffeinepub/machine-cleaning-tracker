import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Phone } from 'lucide-react';

interface ForgotPasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validatePhone = (value: string) => {
        // Accept formats like +1234567890, 0712345678, (555) 555-5555, etc.
        const cleaned = value.replace(/[\s\-().]/g, '');
        return /^\+?\d{7,15}$/.test(cleaned);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phone.trim()) {
            setError('Please enter your phone number.');
            return;
        }
        if (!validatePhone(phone)) {
            setError('Please enter a valid phone number (e.g. +1 555 000 1234).');
            return;
        }

        setIsLoading(true);
        // Simulate async request
        setTimeout(() => {
            setIsLoading(false);
            setSubmitted(true);
        }, 800);
    };

    const handleClose = (val: boolean) => {
        if (!val) {
            // Reset state when closing
            setTimeout(() => {
                setPhone('');
                setError('');
                setSubmitted(false);
                setIsLoading(false);
            }, 200);
        }
        onOpenChange(val);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Forgot Password
                    </DialogTitle>
                    <DialogDescription>
                        Enter your registered phone number and we'll send you a reset link.
                    </DialogDescription>
                </DialogHeader>

                {submitted ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                        <p className="font-semibold text-foreground">Reset link sent!</p>
                        <p className="text-sm text-muted-foreground">
                            If <span className="font-mono text-foreground">{phone}</span> is registered,
                            you'll receive a password reset message shortly.
                        </p>
                        <DialogClose asChild>
                            <Button className="mt-2 w-full" onClick={() => handleClose(false)}>
                                Done
                            </Button>
                        </DialogClose>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="forgot-phone">Phone Number</Label>
                            <Input
                                id="forgot-phone"
                                type="tel"
                                placeholder="+1 555 000 1234"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (error) setError('');
                                }}
                                autoComplete="tel"
                                disabled={isLoading}
                            />
                            {error && (
                                <p className="text-xs text-destructive mt-1">{error}</p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={isLoading}
                                    onClick={() => handleClose(false)}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading} className="gap-1.5">
                                {isLoading ? (
                                    <>
                                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
