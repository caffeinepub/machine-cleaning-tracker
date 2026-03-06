import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useGetAuditLogs } from "../hooks/useQueries";
import { formatDateTime, formatPrincipalShort } from "../utils/dateUtils";

export function SessionLogsPanel() {
  const { data: logs = [], isLoading } = useGetAuditLogs();

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Session Logs
          {!isLoading && (
            <Badge variant="secondary" className="ml-auto text-xs font-normal">
              {logs.length} {logs.length === 1 ? "entry" : "entries"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading && (
          <div className="space-y-2">
            {["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
              <div key={key} className="flex items-center gap-3 py-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40 ml-auto" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && logs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No session events recorded yet.
          </p>
        )}

        {!isLoading && logs.length > 0 && (
          <ScrollArea className="max-h-64">
            <div className="space-y-1">
              {[...logs].reverse().map((entry, idx) => (
                <div
                  key={`${entry.eventType}-${entry.timestamp.toString()}-${idx}`}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm"
                >
                  {entry.eventType === "login" ? (
                    <Badge
                      variant="default"
                      className="gap-1 text-xs shrink-0 bg-primary/90"
                    >
                      <LogIn className="w-3 h-3" />
                      Login
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-xs shrink-0"
                    >
                      <LogOut className="w-3 h-3" />
                      Logout
                    </Badge>
                  )}
                  <span className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                    {formatPrincipalShort(entry.userId)}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
