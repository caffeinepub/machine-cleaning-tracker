import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Renamed to machine part variant.
  type MachinePart = {
    #coolantFiltrationUnit;
    #mistUnit;
    #chillerUnit;
  };

  type Machine = {
    id : Text;
    name : Text;
    lastCleaningDone : Time.Time;
    nextDue : Time.Time;
    machineNo : ?Text;
    machinePart : MachinePart;
  };

  module Machine {
    public func compare(m1 : Machine, m2 : Machine) : Order.Order {
      switch (Text.compare(m1.name, m2.name)) {
        case (#equal) {
          switch (Int.compare(m1.lastCleaningDone, m2.lastCleaningDone)) {
            case (#equal) { Int.compare(m1.nextDue, m2.nextDue) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  let machines = Map.empty<Text, Machine>();

  // Add machine with new fields
  public shared ({ caller }) func addMachine(
    id : Text,
    name : Text,
    lastCleaningDone : Time.Time,
    nextDue : Time.Time,
    machineNo : ?Text,
    machinePart : MachinePart,
  ) : async () {
    if (machines.containsKey(id)) {
      Runtime.trap("Machine with this ID already exists");
    };
    let machine : Machine = {
      id;
      name;
      lastCleaningDone;
      nextDue;
      machineNo;
      machinePart;
    };
    machines.add(id, machine);
  };

  public shared ({ caller }) func updateMachine(
    id : Text,
    name : ?Text,
    lastCleaningDone : ?Time.Time,
    nextDue : ?Time.Time,
    machineNo : ?Text,
    machinePart : ?MachinePart,
  ) : async () {
    switch (machines.get(id)) {
      case (null) { Runtime.trap("Machine not found") };
      case (?machine) {
        let updatedMachine = {
          id = machine.id;
          name = switch (name) { case (null) { machine.name }; case (?n) { n } };
          lastCleaningDone = switch (lastCleaningDone) {
            case (null) { machine.lastCleaningDone };
            case (?date) { date };
          };
          nextDue = switch (nextDue) { case (null) { machine.nextDue }; case (?date) { date } };
          machineNo = switch (machineNo) { case (null) { machine.machineNo }; case (?no) { ?no } };
          machinePart = switch (machinePart) { case (null) { machine.machinePart }; case (?part) { part } };
        };
        machines.add(id, updatedMachine);
      };
    };
  };

  public shared ({ caller }) func deleteMachine(id : Text) : async () {
    if (not machines.containsKey(id)) { Runtime.trap("Machine not found") };
    machines.remove(id);
  };

  public query ({ caller }) func getAllMachines() : async [Machine] {
    let machineArray = machines.values().toArray();
    machineArray.sort();
  };

  public query ({ caller }) func getMachine(id : Text) : async Machine {
    switch (machines.get(id)) {
      case (null) { Runtime.trap("Machine not found") };
      case (?machine) { machine };
    };
  };

  public query ({ caller }) func getMachinesByName(name : Text) : async [Machine] {
    machines.values().toArray().filter(
      func(machine) {
        machine.name.contains(#text name);
      }
    );
  };
};
