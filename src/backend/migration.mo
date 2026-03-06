module {
  public type OldActor = { /* old state omitted intentionally */ };
  public type NewActor = { /* new state omitted intentionally */ };
  public func run(old : OldActor) : NewActor { old };
};
