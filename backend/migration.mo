import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  // Original type definitions.
  type OldCleaningTool = {
    #coolantFiltrationUnit;
    #mistUnit;
    #chillerUnit;
  };

  type OldMachine = {
    id : Text;
    name : Text;
    lastCleaningDone : Time.Time;
    nextDue : Time.Time;
    machineNo : ?Text;
    cleaningTool : OldCleaningTool;
  };

  type OldActor = {
    machines : Map.Map<Text, OldMachine>;
  };

  // New type definitions.
  type NewMachinePart = {
    #coolantFiltrationUnit;
    #mistUnit;
    #chillerUnit;
  };

  type NewMachine = {
    id : Text;
    name : Text;
    lastCleaningDone : Time.Time;
    nextDue : Time.Time;
    machineNo : ?Text;
    machinePart : NewMachinePart;
  };

  type NewActor = {
    machines : Map.Map<Text, NewMachine>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let machines = old.machines.map<Text, OldMachine, NewMachine>(
      func(_id, oldMachine) {
        // Direct compatible type mapping.
        {
          oldMachine with
          machinePart = oldMachine.cleaningTool;
        };
      }
    );
    { machines };
  };
};
