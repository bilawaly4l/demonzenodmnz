module {
  public type BurnTracker = {
    totalBurned : Nat;
    lastUpdated : Int;
  };

  // Burn schedule entries (planned + completed burn events)
  public type BurnScheduleEntry = {
    id      : Text;
    date    : Text;
    amount  : Text;
    reason  : Text;
    status  : Text;   // "planned" | "completed" | "pending"
    txHash  : ?Text;
  };
};
