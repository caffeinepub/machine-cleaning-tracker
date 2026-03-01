import List "mo:core/List";

module {
  type OldActor = {};
  type NewActor = { contacts : List.List<{ fullName : Text; phone : Text; email : Text }> };

  public func run(_old : OldActor) : NewActor {
    { contacts = List.empty<{ fullName : Text; phone : Text; email : Text }>() };
  };
};
