module {
  public type WhitepaperSection = {
    title   : Text;
    content : Text;
  };

  public type WhitepaperContent = {
    title     : Text;
    sections  : [WhitepaperSection];
    updatedAt : Int;
  };

  public type HolderBenefit = {
    id          : Text;
    title       : Text;
    description : Text;
    icon        : Text;
    active      : Bool;
  };

  // Signal of the Week (cross-references SignalTypes.Signal)
  public type SignalOfWeek = {
    signalId   : Text;
    comment    : Text;
    weekOf     : Text;
    featuredAt : Int;
  };

  // Burn schedule events
  public type BurnEvent = {
    id        : Text;
    date      : Text;
    amount    : Text;
    reason    : Text;
    executed  : Bool;
    createdAt : Int;
  };

  // Hype milestones toward launch
  public type HypeMilestone = {
    id          : Text;
    title       : Text;
    targetCount : Nat;
    achieved    : Bool;
    achievedAt  : ?Int;
    order       : Nat;
  };

  // Token metadata
  public type TokenData = {
    supply         : Text;
    burnedAmount   : Text;
    launchDate     : Text;
    launchPlatform : Text;
    ticker         : Text;
    name           : Text;
  };
};
