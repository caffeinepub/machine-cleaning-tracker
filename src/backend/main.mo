import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ========== User Profile ==========

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ========== Machines ==========

  public type MachinePart = {
    #coolantFiltrationUnit;
    #mistUnit;
    #chillerUnit;
  };

  public type Machine = {
    id : Text;
    name : Text;
    lastCleaningDone : Time.Time;
    nextDue : Time.Time;
    machineNo : ?Text;
    machinePart : MachinePart;
  };

  func compareMachines(m1 : Machine, m2 : Machine) : Order.Order {
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

  let machines = Map.empty<Text, Machine>();

  public shared ({ caller }) func addMachine(
    id : Text,
    name : Text,
    lastCleaningDone : Time.Time,
    nextDue : Time.Time,
    machineNo : ?Text,
    machinePart : MachinePart,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add machines");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update machines");
    };
    switch (machines.get(id)) {
      case (null) { Runtime.trap("Machine not found") };
      case (?machine) {
        let updatedMachine : Machine = {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete machines");
    };
    if (not machines.containsKey(id)) { Runtime.trap("Machine not found") };
    machines.remove(id);
  };

  public query ({ caller }) func getAllMachines() : async [Machine] {
    let machineArray = Array.fromIter(machines.values());
    machineArray.sort(compareMachines);
  };

  public query ({ caller }) func getMachine(id : Text) : async Machine {
    switch (machines.get(id)) {
      case (null) { Runtime.trap("Machine not found") };
      case (?machine) { machine };
    };
  };

  public query ({ caller }) func getMachinesByName(name : Text) : async [Machine] {
    let all = Array.fromIter(machines.values());
    all.filter(
      func(machine : Machine) : Bool {
        machine.name.contains(#text name);
      },
    );
  };

  // ========== Audit Log ==========

  public type LogEntry = {
    timestamp : Time.Time;
    userId : Blob;
    eventType : Text;
  };

  var auditLogs : [LogEntry] = [];

  public shared ({ caller }) func logEvent(userId : [Nat8], eventType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can write audit log entries");
    };
    let logEntry : LogEntry = {
      timestamp = Time.now();
      userId = Blob.fromArray(userId);
      eventType;
    };
    auditLogs := auditLogs.concat([logEntry]);
  };

  public query ({ caller }) func getAuditLogs() : async [LogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };
    auditLogs;
  };

  // ========== Contacts ==========

  public type Contact = {
    fullName : Text;
    phone : Text;
    email : Text;
  };

  var contacts : [Contact] = [];

  public shared ({ caller }) func saveContact(fullName : Text, phone : Text, email : Text) : async () {
    // any caller including guests may submit contact details
    contacts := contacts.concat([{ fullName; phone; email }]);
  };

  public query ({ caller }) func getAllContacts() : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all contacts");
    };
    contacts;
  };
};
