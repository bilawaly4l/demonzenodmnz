module {
  public type PushNotification = {
    id : Text;
    title : Text;
    body : Text;
    createdAt : Int;
    expiresAt : ?Int;
    active : Bool;
  };

  public type MarketMoodBanner = {
    mood : Text; // "bullish" | "bearish" | "neutral" | "warning"
    message : Text;
    active : Bool;
    updatedAt : Int;
  };

  public type MaintenanceMode = {
    enabled : Bool;
    message : Text;
    updatedAt : Int;
  };

  public type AuditSnapshot = {
    id : Text;
    snapshotLabel : Text;
    createdAt : Int;
    dataHash : Text;
  };

  public type AbTest = {
    id : Text;
    name : Text;
    variantA : Text;
    variantB : Text;
    active : Bool;
    impressionsA : Nat;
    impressionsB : Nat;
  };

  public type ActivityEntry = {
    hour : Nat;
    dayOfWeek : Nat;
    count : Nat;
  };

  // Internal mutable record for A/B test tracking
  public type AbTestInternal = {
    id : Text;
    name : Text;
    variantA : Text;
    variantB : Text;
    active : Bool;
    var impressionsA : Nat;
    var impressionsB : Nat;
  };

  // Internal mutable record for activity heatmap tracking
  public type ActivityKey = {
    hour : Nat;
    dayOfWeek : Nat;
  };

  public type SignalPerformanceStats = {
    totalSignals : Nat;
    wins : Nat;
    losses : Nat;
    pending : Nat;
    winRate : Float;
    topAssets : [AssetStats];
    weeklyTrend : [DayStats];
  };

  public type AssetStats = {
    asset : Text;
    wins : Nat;
    losses : Nat;
  };

  public type DayStats = {
    day : Text;
    wins : Nat;
    losses : Nat;
  };
};
