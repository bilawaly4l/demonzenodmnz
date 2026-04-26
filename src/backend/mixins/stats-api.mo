import List "mo:core/List";
import Set "mo:core/Set";
import Float "mo:core/Float";
import SignalTypes "../types/signals";
import StatsTypes "../types/stats";
import NotifyTypes "../types/notify";
import Common "../types/common";
import StatsLib "../lib/stats";
import AuthLib "../lib/auth";

mixin (
  signals : List.List<SignalTypes.Signal>,
  notifyEntries : List.List<NotifyTypes.NotifyMe>,
  statsConfigRef : { var value : StatsTypes.StatsConfig },
  sessions : Set.Set<Text>,
) {
  public query func getStats() : async StatsTypes.Stats {
    StatsLib.getStats(signals, statsConfigRef.value);
  };

  public func setStatsConfig(
    sessionToken : Text,
    config : StatsTypes.StatsConfig,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    statsConfigRef.value := config;
    #ok(());
  };

  public func getStatsConfig(
    sessionToken : Text,
  ) : async Common.Result<StatsTypes.StatsConfig, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(statsConfigRef.value);
  };

  /// Admin: get analytics (signals by market, notify-me by date)
  public func getAnalytics(
    sessionToken : Text,
  ) : async Common.Result<StatsTypes.Analytics, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(StatsLib.getAnalytics(signals, notifyEntries));
  };

  /// Admin: export analytics as CSV
  public func getAnalyticsCsv(
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let analytics = StatsLib.getAnalytics(signals, notifyEntries);
    let stats = StatsLib.getStats(signals, statsConfigRef.value);

    // Build CSV: header + one row per market with aggregated stats
    var csv = "Date,Market,Signals,Wins,Losses,WinRate,Signups\n";

    // Per-market rows
    for (mc in analytics.signalsByMarket.values()) {
      // Count wins and losses for this market
      var wins : Nat = 0;
      var losses : Nat = 0;
      for (s in signals.values()) {
        let marketLabel = switch (s.marketType) {
          case (#Crypto) "Crypto";
          case (#Forex)  "Forex";
          case (#Stock)  "Stock";
        };
        if (marketLabel == mc.market) {
          switch (s.result) {
            case (#Win)  { wins := wins + 1 };
            case (#Loss) { losses := losses + 1 };
            case _       {};
          };
        };
      };
      let total = wins + losses;
      let winRate : Float = if (total == 0) { 0.0 } else {
        wins.toFloat() / total.toFloat() * 100.0
      };
      let winRateText = winRate.toText();
      csv := csv # "ALL," # mc.market # "," # mc.count.toText() # "," # wins.toText() # "," # losses.toText() # "," # winRateText # ",-\n";
    };

    // Notify me signups by date row
    for (dc in analytics.notifyMeByDate.values()) {
      csv := csv # dc.date # ",ALL,-,-,-,-," # dc.count.toText() # "\n";
    };

    // Summary row — winRate is already a percentage (0–100) from StatsLib
    let overallWinRate = stats.winRate.toText();
    csv := csv # "TOTAL,ALL," # stats.totalSignals.toText() # "," # stats.wins.toText() # "," # stats.losses.toText() # "," # overallWinRate # "," # analytics.totalNotifyMe.toText() # "\n";

    #ok(csv);
  };
};
