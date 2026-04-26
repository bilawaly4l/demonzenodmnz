module {
  public type Stats = {
    totalSignals : Nat;
    wins : Nat;
    losses : Nat;
    active : Nat;
    winRate : Float;
    assetsCovered : Nat;
  };

  public type StatsConfig = {
    useManual : Bool;
    manualStats : ?Stats;
  };

  public type MarketCount = {
    market : Text;
    count : Nat;
  };

  public type DateCount = {
    date : Text;
    count : Nat;
  };

  public type Analytics = {
    signalsByMarket : [MarketCount];
    notifyMeByDate : [DateCount];
    totalNotifyMe : Nat;
  };
};
