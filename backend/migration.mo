import List "mo:core/List";

module {
  type OldActor = {
    var auditLogs : List.List<{ timestamp : Int; userId : Blob; eventType : Text }>;
    var contacts : List.List<{ fullName : Text; phone : Text; email : Text }>;
  };

  // The new actor type just uses arrays so its type equals the main actor without need to duplicate here.

  // Migration function converting List type to Array
  public func run(old : OldActor) : {
    var auditLogs : [{ timestamp : Int; userId : Blob; eventType : Text }];
    var contacts : [{ fullName : Text; phone : Text; email : Text }];
  } {
    {
      var auditLogs = old.auditLogs.toArray();
      var contacts = old.contacts.toArray();
    };
  };
};
