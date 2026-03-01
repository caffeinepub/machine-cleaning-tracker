import { useState } from 'react';
import { useGetAllMachines } from '../hooks/useQueries';
import { MachineCard } from '../components/MachineCard';
import { AddMachineModal } from '../components/AddMachineModal';
import { OverdueAlertBanner } from '../components/OverdueAlertBanner';
import { StatsBar } from '../components/StatsBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCw, Wrench } from 'lucide-react';

export function Dashboard() {
    const [addOpen, setAddOpen] = useState(false);
    const { data: machines = [], isLoading, isError, refetch, isFetching } = useGetAllMachines();

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
                        <Button
                            onClick={() => setAddOpen(true)}
                            size="sm"
                            className="gap-2 font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Add Machine
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
                {/* Overdue alert banner */}
                {!isLoading && machines.length > 0 && (
                    <OverdueAlertBanner machines={machines} />
                )}

                {/* Stats bar */}
                {!isLoading && machines.length > 0 && (
                    <StatsBar machines={machines} />
                )}

                {/* Section heading */}
                <div className="flex items-center justify-between">
                    <h2 className="font-condensed text-2xl font-bold text-foreground tracking-wide">
                        All Machines
                        {machines.length > 0 && (
                            <span className="ml-2 text-base font-sans font-normal text-muted-foreground">
                                ({machines.length})
                            </span>
                        )}
                    </h2>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-lg border border-border p-5 space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-8 w-full mt-2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <Wrench className="w-7 h-7 text-destructive" />
                        </div>
                        <h3 className="font-condensed text-xl font-bold text-foreground mb-1">
                            Failed to Load Machines
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Could not connect to the backend. Please try again.
                        </p>
                        <Button variant="outline" onClick={() => refetch()} className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && machines.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                            <Wrench className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-condensed text-2xl font-bold text-foreground mb-2">
                            No Machines Yet
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                            Add your first machine to start tracking machine part replacements and due dates.
                        </p>
                        <Button onClick={() => setAddOpen(true)} className="gap-2 font-semibold">
                            <Plus className="w-4 h-4" />
                            Add First Machine
                        </Button>
                    </div>
                )}

                {/* Machine grid */}
                {!isLoading && !isError && machines.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {machines.map((machine) => (
                            <MachineCard key={machine.id} machine={machine} />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card mt-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>© {new Date().getFullYear()} Machine Part Tracker. All rights reserved.</span>
                    <span className="flex items-center gap-1">
                        Built with <span className="text-primary">♥</span> using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'unknown-app')}`}
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
        </div>
    );
}
