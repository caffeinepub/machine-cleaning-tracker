import { useEffect, useState } from "react";
import type { Machine } from "../backend";
import { getMachineStatus } from "../utils/dateUtils";

interface UseBrowserNotificationsResult {
  permissionGranted: boolean;
  permissionState: NotificationPermission;
}

export function useBrowserNotifications(
  machines: Machine[],
): UseBrowserNotificationsResult {
  const notificationsSupported = typeof Notification !== "undefined";
  const [permissionState, setPermissionState] =
    useState<NotificationPermission>(
      notificationsSupported ? Notification.permission : "denied",
    );

  // Request permission on mount if not yet decided
  useEffect(() => {
    if (!notificationsSupported) return;
    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        setPermissionState(perm);
      });
    }
  }, [notificationsSupported]);

  // Fire notifications when machines load and permission is granted
  useEffect(() => {
    if (!notificationsSupported) return;
    if (Notification.permission !== "granted") return;
    if (machines.length === 0) return;

    for (const machine of machines) {
      const status = getMachineStatus(machine.nextDue);
      if (status !== "due-today" && status !== "overdue") continue;

      const key = `browser_notif_${machine.id}_${machine.nextDue.toString()}`;
      if (localStorage.getItem(key)) continue;

      const statusText =
        status === "overdue" ? "OVERDUE" : "due within 24 hours";

      const machineName =
        machine.name + (machine.machineNo ? ` #${machine.machineNo}` : "");

      try {
        new Notification("Machine Cleaning Due!", {
          body: `${machineName} – cleaning is ${statusText}!`,
          icon: "/assets/generated/logo-cleantrack.dim_256x256.png",
        });
        localStorage.setItem(key, "1");
      } catch {
        // Notification may fail silently in some environments
      }
    }
  }, [machines, notificationsSupported]);

  return {
    permissionGranted: permissionState === "granted",
    permissionState,
  };
}
