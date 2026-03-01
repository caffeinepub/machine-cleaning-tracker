import { useState, useEffect, useRef } from 'react';
import { useGetAllMachines } from '../hooks/useQueries';
import { MachineCard } from '../components/MachineCard';
import { AddMachineModal } from '../components/AddMachineModal';
import { OverdueAlertBanner } from '../components/OverdueAlertBanner';
import { DueTodayAlertBanner } from '../components/DueTodayAlertBanner';
import { StatsBar } from '../components/StatsBar';
import { SessionLogsPanel } from '../components/SessionLogsPanel';
import { PhoneLoginForm } from '../components/PhoneLoginForm';
import { ForgotPasswordDialog } from '../components/ForgotPasswordDialog';
import { getMachineStatus } from '../utils/dateUtils';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, RefreshCw, Wrench, LogIn, LogOut, Lock } from 'lucide-react';

export function Dashboard() {
    const [addOpen, setAddOpen] = useState(false);
    const [forgotOpen, setForgotOpen] = useState(false);
    const { data: machines = [], isLoading, isError, refetch, isFetching } = useGetAllMachines();
    const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();
    const { actor } = useActor();

    const dueTodayMachines = machines.filter(
        (m) => getMachineStatus(m.nextDue) === 'due-today'
    );

    // Track previous identity to detect login/logout transitions
    const prevIdentityRef = useRef<typeof identity>(undefined);

    useEffect(() => {
        const prev = prevIdentityRef.current;
        const curr = identity;

        if (!actor) return;

        // Login event: identity just became available
        if (!prev && curr) {
            const principalBytes = Array.from(
                curr.getPrincipal().toUint8Array()
            ) as number[];
            actor.logEvent(new Uint8Array(principalBytes), 'login').catch(() => {});
        }

        // Logout event: identity just became unavailable
        if (prev && !curr) {
            const principalBytes = Array.from(
                prev.getPrincipal().toUint8Array()
            ) as number[];
            actor.logEvent(new Uint8Array(principalBytes), 'logout').catch(() => {});
        }

        prevIdentityRef.current = curr;
    }, [identity, actor]);

    const isAuthenticated = !!identity;

    const handleLogout = () => {
        clear();
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-card border-b border-border shadow-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/generated/logo-cleantrack.dim_256x256.png"
                            alt="Machine Part Tracker Logo"
                            className="w-9 h-9 rounded-md object-cover"
                        />
                        <div>
                            <h1 className="font-condensed text-xl font-bold leading-none text-foreground tracking-wide">
                                PartTrack
                            </h1>
                            <p className="text-xs text-muted-foreground font-medium leading-none mt-0.5">
                                Machine Part Manager
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="h-9 w-9"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                        </Button>

                        {isAuthenticated ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 font-semibold"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 font-semibold"
                                onClick={login}
                                disabled={isLoggingIn}
                            >
                                <LogIn className="w-4 h-4" />
                                {isLoggingIn ? 'Signing in…' : 'Login'}
                            </Button>
                        )}

                        <Button
                            size="sm"
                            className="gap-1.5 font-semibold"
                            onClick={() => setAddOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Add Machine
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
                {/* Due Today Alert Banner — shown above overdue banner */}
                {!isLoading && <DueTodayAlertBanner machines={dueTodayMachines} />}

                {/* Overdue Alert Banner */}
                {!isLoading && <OverdueAlertBanner machines={machines} />}

                {/* Stats Bar */}
                {!isLoading && machines.length > 0 && (
                    <StatsBar machines={machines} />
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <p className="text-status-danger font-semibold mb-2">Failed to load machines.</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && machines.length === 0 && (
                    <div className="text-center py-16 space-y-3">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                            <Wrench className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="font-condensed text-xl font-bold text-foreground">No machines yet</h2>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                            Add your first machine to start tracking part replacements and due dates.
                        </p>
                        <Button className="gap-1.5 font-semibold mt-2" onClick={() => setAddOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Add First Machine
                        </Button>
                    </div>
                )}

                {/* Machine Grid */}
                {!isLoading && !isError && machines.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {machines.map((machine) => (
                            <MachineCard key={machine.id} machine={machine} />
                        ))}
                    </div>
                )}

                {/* Login / Session Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    {/* Phone Login Card */}
                    {!isAuthenticated && (
                        <Card className="border-border shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <Lock className="w-4 h-4 text-primary" />
                                    Sign In
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Log in with your phone number to access session logs and admin features.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <PhoneLoginForm onForgotPassword={() => setForgotOpen(true)} />

                                <div className="flex items-center gap-2">
                                    <Separator className="flex-1" />
                                    <span className="text-xs text-muted-foreground">or</span>
                                    <Separator className="flex-1" />
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-1.5 font-semibold"
                                    onClick={login}
                                    disabled={isLoggingIn}
                                >
                                    <LogIn className="w-4 h-4" />
                                    {isLoggingIn ? 'Signing in…' : 'Continue with Identity'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Session Logs Panel — only shown when authenticated */}
                    {isAuthenticated && (
                        <div className="md:col-span-2">
                            <SessionLogsPanel />
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card mt-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>© {new Date().getFullYear()} PartTrack — Machine Part Manager</span>
                    <span>
                        Built with{' '}
                        <span className="text-primary">♥</span>{' '}
                        using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'parttrack')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground transition-colors"
                        >
                            caffeine.ai
                        </a>
                    </span>
                </div>
            </footer>

            <AddMachineModal open={addOpen} onOpenChange={setAddOpen} />
            <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
        </div>
    );
}
