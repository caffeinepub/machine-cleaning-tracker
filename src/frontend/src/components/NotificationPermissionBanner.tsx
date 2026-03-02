import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { useState } from "react";

interface NotificationPermissionBannerProps {
  onPermissionChange?: (permission: NotificationPermission) => void;
}

export function NotificationPermissionBanner({
  onPermissionChange,
}: NotificationPermissionBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied",
  );

  // Only show when permission is 'default' (not yet asked) and not dismissed
  if (permission !== "default" || dismissed) return null;

  const handleEnable = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    onPermissionChange?.(result);
    if (result !== "default") {
      setDismissed(true);
    }
  };

  return (
    <output
      data-ocid="notif_permission.panel"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm"
    >
      <Bell
        className="w-4 h-4 flex-shrink-0 text-amber-600"
        aria-hidden="true"
      />
      <p className="flex-1 text-sm font-medium leading-snug">
        Enable browser notifications to get alerts when machine cleaning is due
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          data-ocid="notif_permission.button"
          size="sm"
          variant="outline"
          onClick={handleEnable}
          className="h-7 px-3 text-xs font-semibold border-amber-400 text-amber-800 hover:bg-amber-100 hover:border-amber-500 bg-amber-50"
        >
          Enable
        </Button>
        <button
          type="button"
          data-ocid="notif_permission.close_button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notification banner"
          className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity text-amber-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </output>
  );
}
