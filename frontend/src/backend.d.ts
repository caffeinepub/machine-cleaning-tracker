import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface LogEntry {
    userId: Uint8Array;
    timestamp: Time;
    eventType: string;
}
export interface Contact {
    fullName: string;
    email: string;
    phone: string;
}
export interface Machine {
    id: string;
    lastCleaningDone: Time;
    name: string;
    nextDue: Time;
    machineNo?: string;
    machinePart: MachinePart;
}
export interface UserProfile {
    name: string;
}
export enum MachinePart {
    chillerUnit = "chillerUnit",
    mistUnit = "mistUnit",
    coolantFiltrationUnit = "coolantFiltrationUnit"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMachine(id: string, name: string, lastCleaningDone: Time, nextDue: Time, machineNo: string | null, machinePart: MachinePart): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMachine(id: string): Promise<void>;
    getAllContacts(): Promise<Array<Contact>>;
    getAllMachines(): Promise<Array<Machine>>;
    getAuditLogs(): Promise<Array<LogEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMachine(id: string): Promise<Machine>;
    getMachinesByName(name: string): Promise<Array<Machine>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logEvent(userId: Uint8Array, eventType: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveContact(fullName: string, phone: string, email: string): Promise<void>;
    updateMachine(id: string, name: string | null, lastCleaningDone: Time | null, nextDue: Time | null, machineNo: string | null, machinePart: MachinePart | null): Promise<void>;
}
