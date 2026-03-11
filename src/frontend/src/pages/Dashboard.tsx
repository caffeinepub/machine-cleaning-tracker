import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, LogIn, Plus, RefreshCw, Wrench } from "lucide-react";
import { useState } from "react";
import { AddMachineModal } from "../components/AddMachineModal";
import { DueTodayAlertBanner } from "../components/DueTodayAlertBanner";
import { MachineCard } from "../components/MachineCard";
import { OverdueAlertBanner } from "../components/OverdueAlertBanner";
import { StatsBar } from "../components/StatsBar";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllMachines } from "../hooks/useQueries";
import { getMachineStatus } from "../utils/dateUtils";

export function Dashboard() {
  const [addOpen, setAddOpen] = useState(false);
  const {
    data: machines = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllMachines();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor();

  const dueTodayMachines = machines.filter(
    (m) => getMachineStatus(m.nextDue) === "due-today",
  );

  const isAuthenticated = !!identity;
  const isActorReady = isAuthenticated && !!actor && !isActorFetching;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
                Track machine cleaning schedules &amp; due dates
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
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>

            {isAuthenticated && (
              <Button
                size="sm"
                className="gap-1.5 font-semibold"
                onClick={() => setAddOpen(true)}
                disabled={!isActorReady}
              >
                {isActorFetching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isActorFetching ? "Connecting..." : "Add Machine"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {/* Due Today Alert Banner — shown above overdue banner */}
        {isAuthenticated && !isLoading && (
          <DueTodayAlertBanner machines={dueTodayMachines} />
        )}

        {/* Overdue Alert Banner */}
        {isAuthenticated && !isLoading && (
          <OverdueAlertBanner machines={machines} />
        )}

        {/* Stats Bar */}
        {isAuthenticated && !isLoading && machines.length > 0 && (
          <StatsBar machines={machines} />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
              <div
                key={key}
                className="rounded-lg border border-border p-4 space-y-3"
              >
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
            <p className="text-status-danger font-semibold mb-2">
              Failed to load machines.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Not Logged In State */}
        {!isAuthenticated && !isLoading && (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-condensed text-xl font-bold text-foreground">
              Login to get started
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Sign in to track machine cleaning schedules and due dates.
            </p>
            <Button
              className="gap-1.5 font-semibold mt-2"
              onClick={login}
              disabled={isLoggingIn}
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Signing in…" : "Login"}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {isAuthenticated && !isLoading && !isError && machines.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Wrench className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-condensed text-xl font-bold text-foreground">
              No machines yet
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Add your first machine to start tracking cleaning schedules and
              due dates.
            </p>
            <Button
              className="gap-1.5 font-semibold mt-2"
              onClick={() => setAddOpen(true)}
              disabled={!isActorReady}
            >
              {isActorFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isActorFetching ? "Connecting..." : "Add First Machine"}
            </Button>
          </div>
        )}

        {/* Machine Grid */}
        {isAuthenticated && !isLoading && !isError && machines.length > 0 && (
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
          <span>© {new Date().getFullYear()} Machine Cleaning Tracker</span>
          <span>
            Built with <span className="text-primary">♥</span> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "machine-cleaning-tracker")}`}
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
