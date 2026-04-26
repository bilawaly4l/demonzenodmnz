import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import SignalTypes "../types/signals";
import StatsTypes "../types/stats";
import NotifyTypes "../types/notify";

module {
  public type Stats = StatsTypes.Stats;
  public type StatsConfig = StatsTypes.StatsConfig;
  public type Analytics = StatsTypes.Analytics;
  public type Signal = SignalTypes.Signal;
  public type NotifyMe = NotifyTypes.NotifyMe;

  public func calcStats(signals : List.List<Signal>) : Stats {
    var total = 0;
    var wins = 0;
    var losses = 0;
    var active = 0;
    let assetMap = Map.empty<Text, Bool>();
    signals.forEach(func(s) {
      total += 1;
      switch (s.result) {
        case (#Win) { wins += 1 };
        case (#Loss) { losses += 1 };
        case (#Active) { active += 1 };
        case (#Expired) {}; // expired signals don't count toward active
      };
      assetMap.add(s.asset, true);
    });
    let winRate : Float = if (total == 0) {
      0.0;
    } else {
      wins.toFloat() / total.toFloat() * 100.0;
    };
    { totalSignals = total; wins; losses; active; winRate; assetsCovered = assetMap.size() };
  };

  public func getStats(
    signals : List.List<Signal>,
    config : StatsConfig,
  ) : Stats {
    if (config.useManual) {
      switch (config.manualStats) {
        case (?manual) { manual };
        case null { calcStats(signals) };
      };
    } else {
      calcStats(signals);
    };
  };

  /// Take up to maxChars chars from text for a date prefix
  func datePrefix(t : Text) : Text {
    let maxChars = 10;
    var i = 0;
    var result = "";
    for (c in t.toIter()) {
      if (i >= maxChars) { return result };
      result := result # Text.fromChar(c);
      i += 1;
    };
    result;
  };

  /// Compute analytics: signals by market type and notify-me signups by date
  public func getAnalytics(
    signals : List.List<Signal>,
    notifyEntries : List.List<NotifyMe>,
  ) : Analytics {
    // Count signals by market type
    let marketCounts = Map.empty<Text, Nat>();
    signals.forEach(func(s) {
      let key = switch (s.marketType) {
        case (#Crypto) { "Crypto" };
        case (#Forex) { "Forex" };
        case (#Stock) { "Stock" };
      };
      let current = switch (marketCounts.get(key)) {
        case (?n) { n };
        case null { 0 };
      };
      marketCounts.add(key, current + 1);
    });
    let signalsByMarket = marketCounts.entries().map(
      func((market, count) : (Text, Nat)) : StatsTypes.MarketCount {
        { market; count };
      }
    ).toArray();

    // Count notify-me signups by date prefix
    let dateCounts = Map.empty<Text, Nat>();
    notifyEntries.forEach(func(e) {
      let date = datePrefix(e.dateSubmitted);
      let current = switch (dateCounts.get(date)) {
        case (?n) { n };
        case null { 0 };
      };
      dateCounts.add(date, current + 1);
    });
    let notifyMeByDate = dateCounts.entries().map(
      func((date, count) : (Text, Nat)) : StatsTypes.DateCount {
        { date; count };
      }
    ).toArray();

    {
      signalsByMarket;
      notifyMeByDate;
      totalNotifyMe = notifyEntries.size();
    };
  };
};
