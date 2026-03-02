import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LogEntry, Machine, UserProfile } from "../backend";
import type { MachinePart } from "../backend";
import { calculateNextDueFromToday, dateToTime } from "../utils/dateUtils";
import { useActor } from "./useActor";

const MACHINES_KEY = ["machines"];
const AUDIT_LOGS_KEY = ["auditLogs"];
const CURRENT_USER_PROFILE_KEY = ["currentUserProfile"];
const CONTACTS_KEY = ["contacts"];

export function useGetAllMachines() {
  const { actor, isFetching } = useActor();

  return useQuery<Machine[]>({
    queryKey: MACHINES_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMachines();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useGetAuditLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<LogEntry[]>({
    queryKey: AUDIT_LOGS_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuditLogs();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: CURRENT_USER_PROFILE_KEY,
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      fullName: string;
      phone: string;
      email: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.saveContact(params.fullName, params.phone, params.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });
    },
  });
}

export function useAddMachine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      lastCleaningDone: Date;
      nextDue: Date;
      machineNo: string | null;
      machinePart: MachinePart;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.addMachine(
        params.id,
        params.name,
        dateToTime(params.lastCleaningDone),
        dateToTime(params.nextDue),
        params.machineNo,
        params.machinePart,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MACHINES_KEY });
    },
  });
}

export function useUpdateMachine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      name?: string;
      lastCleaningDone?: Date;
      nextDue?: Date;
      machineNo?: string | null;
      machinePart?: MachinePart | null;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.updateMachine(
        params.id,
        params.name ?? null,
        params.lastCleaningDone ? dateToTime(params.lastCleaningDone) : null,
        params.nextDue ? dateToTime(params.nextDue) : null,
        params.machineNo !== undefined ? params.machineNo : null,
        params.machinePart !== undefined ? params.machinePart : null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MACHINES_KEY });
    },
  });
}

export function useDeleteMachine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteMachine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MACHINES_KEY });
    },
  });
}

/** Mark machine part replacement as done today, recalculating nextDue based on the original interval */
export function useMarkPartDone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (machine: Machine) => {
      if (!actor) throw new Error("Actor not ready");
      const today = new Date();
      const newNextDue = calculateNextDueFromToday(
        machine.lastCleaningDone,
        machine.nextDue,
      );
      await actor.updateMachine(
        machine.id,
        null,
        dateToTime(today),
        dateToTime(newNextDue),
        null,
        null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MACHINES_KEY });
    },
  });
}

/** Reschedule the next due date for a machine */
export function useRescheduleNextDue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; nextDue: Date }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.updateMachine(
        params.id,
        null,
        null,
        dateToTime(params.nextDue),
        null,
        null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MACHINES_KEY });
    },
  });
}
