import { useState } from 'react';
import { useSaveContact, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Phone, Mail, CheckCircle2, ArrowRight, SkipForward } from 'lucide-react';

interface AddContactDetailsPageProps {
    onComplete: () => void;
    userName?: string;
}

export function AddContactDetailsPage({ onComplete, userName }: AddContactDetailsPageProps) {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});
    const [saved, setSaved] = useState(false);

    const saveContact = useSaveContact();
    const { data: userProfile } = useGetCallerUserProfile();

    const displayName = userName || userProfile?.name || null;

    const validatePhone = (value: string) => {
        const cleaned = value.replace(/[\s\-().]/g, '');
        return /^\+?\d{7,15}$/.test(cleaned);
    };

    const validateEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required.';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Enter a valid phone number (e.g. +1 555 000 1234).';
        }
        if (!email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Enter a valid email address.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await saveContact.mutateAsync({ fullName: fullName.trim(), phone: phone.trim(), email: email.trim() });
            setSaved(true);
            setTimeout(() => {
                onComplete();
            }, 1200);
        } catch {
            // silently handle error — still allow proceeding
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    if (saved) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-primary" />
                    </div>
                    <h2 className="font-condensed text-2xl font-bold text-foreground">Details Saved!</h2>
                    <p className="text-muted-foreground text-sm">Taking you to the dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-card border-b border-border shadow-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
                    <img
                        src="/assets/generated/logo-cleantrack.dim_256x256.png"
                        alt="Machine Cleaning Tracker Logo"
                        className="w-9 h-9 rounded-md object-cover"
                    />
                    <div>
                        <h1 className="font-condensed text-xl font-bold leading-none text-foreground tracking-wide">
                            Machine Cleaning Tracker
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium leading-none mt-0.5">
                            Machine Cleaning Tracker
                        </p>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md space-y-6">
                    {/* Welcome greeting */}
                    <div className="text-center space-y-1">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <User className="w-7 h-7 text-primary" />
                        </div>
                        {displayName ? (
                            <>
                                <h2 className="font-condensed text-2xl font-bold text-foreground">
                                    Welcome, {displayName}!
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    You're now logged in. Add your contact details below.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="font-condensed text-2xl font-bold text-foreground">
                                    Welcome!
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    You're now logged in. Add your contact details below.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Contact Details Card */}
                    <Card className="border-border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                Add Contact Details
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Fill in your contact information. You can skip this step if you prefer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4" noValidate>
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact-fullname" className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="contact-fullname"
                                            type="text"
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                                            }}
                                            autoComplete="name"
                                            disabled={saveContact.isPending}
                                            className="pl-9"
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-xs text-destructive">{errors.fullName}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact-phone" className="text-sm font-medium">
                                        Phone Number
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="contact-phone"
                                            type="tel"
                                            placeholder="+1 555 000 1234"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                                            }}
                                            autoComplete="tel"
                                            disabled={saveContact.isPending}
                                            className="pl-9"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-xs text-destructive">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Email Address */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact-email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                            }}
                                            autoComplete="email"
                                            disabled={saveContact.isPending}
                                            className="pl-9"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <Button
                                        type="submit"
                                        className="flex-1 gap-1.5 font-semibold"
                                        disabled={saveContact.isPending}
                                    >
                                        {saveContact.isPending ? (
                                            <>Saving…</>
                                        ) : (
                                            <>
                                                <ArrowRight className="w-4 h-4" />
                                                Save &amp; Continue
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="gap-1.5 font-semibold"
                                        onClick={handleSkip}
                                        disabled={saveContact.isPending}
                                    >
                                        <SkipForward className="w-4 h-4" />
                                        Skip
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card mt-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>© {new Date().getFullYear()} Machine Cleaning Tracker</span>
                    <span>
                        Built with{' '}
                        <span className="text-primary">♥</span>{' '}
                        using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'machine-cleaning-tracker')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground transition-colors"
                        >
                            caffeine.ai
                        </a>
                    </span>
                </div>
            </footer>
        </div>
    );
}
