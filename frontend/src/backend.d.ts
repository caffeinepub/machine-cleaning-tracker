import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Machine {
    id: string;
    lastCleaningDone: Time;
    name: string;
    nextDue: Time;
    machineNo?: string;
    machinePart: MachinePart;
}
export type Time = bigint;
export enum MachinePart {
    chillerUnit = "chillerUnit",
    mistUnit = "mistUnit",
    coolantFiltrationUnit = "coolantFiltrationUnit"
}
export interface backendInterface {
    addMachine(id: string, name: string, lastCleaningDone: Time, nextDue: Time, machineNo: string | null, machinePart: MachinePart): Promise<void>;
    deleteMachine(id: string): Promise<void>;
    getAllMachines(): Promise<Array<Machine>>;
    getMachine(id: string): Promise<Machine>;
    getMachinesByName(name: string): Promise<Array<Machine>>;
    updateMachine(id: string, name: string | null, lastCleaningDone: Time | null, nextDue: Time | null, machineNo: string | null, machinePart: MachinePart | null): Promise<void>;
}
