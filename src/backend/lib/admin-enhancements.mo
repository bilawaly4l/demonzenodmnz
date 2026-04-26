import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import AdminTypes "../types/admin-enhancements";
import SignalTypes "../types/signals";
import AuditTypes "../types/audit";

module {
  public type PushNotification = AdminTypes.PushNotification;
  public type MarketMoodBanner = AdminTypes.MarketMoodBanner;
  public type MaintenanceMode = AdminTypes.MaintenanceMode;
  public type AuditSnapshot = AdminTypes.AuditSnapshot;
  public type AbTest = AdminTypes.AbTest;
  public type AbTestInternal = AdminTypes.AbTestInternal;
  public type ActivityEntry = AdminTypes.ActivityEntry;
  public type SignalPerformanceStats = AdminTypes.SignalPerformanceStats;
  public type AssetStats = AdminTypes.AssetStats;
  public type DayStats = AdminTypes.DayStats;

  // ── Push Notifications ────────────────────────────────────────────────────

  public func createPushNotification(
    notifications : List.List<PushNotification>,
    nextId : Nat,
    title : Text,
    body : Text,
  ) : (PushNotification, Nat) {
    let id = "notif-" # nextId.toText();
    let notif : PushNotification = {
      id;
      title;
      body;
      createdAt = Time.now();
      expiresAt = null;
      active = true;
    };
    notifications.add(notif);
    (notif, nextId + 1);
  };

  public func getActivePushNotifications(notifications : List.List<PushNotification>) : [PushNotification] {
    notifications.filter(func(n : PushNotification) : Bool { n.active }).toArray();
  };

  public func dismissPushNotification(notifications : List.List<PushNotification>, id : Text) {
    notifications.mapInPlace(func(n : PushNotification) : PushNotification {
      if (n.id == id) { { n with active = false } } else { n };
    });
  };

  // ── Market Mood Banner ────────────────────────────────────────────────────

  public func setMarketMoodBanner(
    bannerRef : { var value : ?MarketMoodBanner },
    mood : Text,
    message : Text,
  ) {
    bannerRef.value := ?{
      mood;
      message;
      active = true;
      updatedAt = Time.now();
    };
  };

  public func getMarketMoodBanner(bannerRef : { var value : ?MarketMoodBanner }) : ?MarketMoodBanner {
    bannerRef.value;
  };

  // ── Admin Role Validation ─────────────────────────────────────────────────

  /// Returns "admin" for passcode 252525, null otherwise.
  /// Analyst role reserved for future configuration.
  public func validateAdminRole(passcodeValid : Bool) : ?Text {
    if (passcodeValid) { ?"admin" } else { null };
  };

  // ── Scheduled Signal Publishing ───────────────────────────────────────────

  /// Auto-publish signals where publishAt <= now and still isDraft.
  /// Returns the count of newly published signals.
  public func publishScheduledSignals(signals : List.List<SignalTypes.Signal>) : Nat {
    let now = Time.now();
    var published = 0;
    signals.mapInPlace(func(s : SignalTypes.Signal) : SignalTypes.Signal {
      if (s.isDraft) {
        switch (s.publishAt) {
          case (?at) {
            if (at <= now) {
              published += 1;
              { s with isDraft = false };
            } else { s };
          };
          case null { s };
        };
      } else { s };
    });
    published;
  };

  /// Update a signal's schedule (publishAt + isDraft = true).
  public func scheduleSignal(
    signals : List.List<SignalTypes.Signal>,
    signalId : Text,
    publishAt : Int,
  ) : Bool {
    var found = false;
    signals.mapInPlace(func(s : SignalTypes.Signal) : SignalTypes.Signal {
      if (s.id == signalId) {
        found := true;
        { s with publishAt = ?publishAt; isDraft = true };
      } else { s };
    });
    found;
  };

  // ── Maintenance Mode ──────────────────────────────────────────────────────

  public func setMaintenanceMode(
    maintenanceRef : { var value : MaintenanceMode },
    enabled : Bool,
    message : Text,
  ) {
    maintenanceRef.value := { enabled; message; updatedAt = Time.now() };
  };

  public func getMaintenanceMode(maintenanceRef : { var value : MaintenanceMode }) : MaintenanceMode {
    maintenanceRef.value;
  };

  // ── Audit Snapshots ───────────────────────────────────────────────────────

  public func createAuditSnapshot(
    snapshots : List.List<AuditSnapshot>,
    auditLog : List.List<AuditTypes.AuditEntry>,
    nextId : Nat,
    snapshotLabel : Text,
  ) : (AuditSnapshot, Nat) {
    // Simple hash: combine audit log size + timestamp as a lightweight fingerprint
    let logSize = auditLog.size();
    let now = Time.now();
    let dataHash = (logSize.toText() # "-" # now.toText()).encodeUtf8().size().toText() # "-snap";
    let id = "snap-" # nextId.toText();
    let snap : AuditSnapshot = { id; snapshotLabel; createdAt = now; dataHash };
    snapshots.add(snap);
    (snap, nextId + 1);
  };

  public func listAuditSnapshots(snapshots : List.List<AuditSnapshot>) : [AuditSnapshot] {
    snapshots.toArray();
  };

  // ── A/B Content Testing ───────────────────────────────────────────────────

  public func createAbTest(
    abTests : List.List<AbTestInternal>,
    nextId : Nat,
    name : Text,
    variantA : Text,
    variantB : Text,
  ) : (Text, Nat) {
    let id = "ab-" # nextId.toText();
    let test : AbTestInternal = {
      id;
      name;
      variantA;
      variantB;
      active = true;
      var impressionsA = 0;
      var impressionsB = 0;
    };
    abTests.add(test);
    (id, nextId + 1);
  };

  public func getAbTests(abTests : List.List<AbTestInternal>) : [AbTest] {
    abTests.map<AbTestInternal, AbTest>(func(t : AbTestInternal) : AbTest {
      {
        id = t.id;
        name = t.name;
        variantA = t.variantA;
        variantB = t.variantB;
        active = t.active;
        impressionsA = t.impressionsA;
        impressionsB = t.impressionsB;
      };
    }).toArray();
  };

  public func recordAbImpression(abTests : List.List<AbTestInternal>, testId : Text, variant : Text) {
    abTests.forEach(func(t : AbTestInternal) {
      if (t.id == testId) {
        if (variant == "A") {
          t.impressionsA += 1;
        } else if (variant == "B") {
          t.impressionsB += 1;
        };
      };
    });
  };

  public func getAbVariant(abTests : List.List<AbTestInternal>, testId : Text) : Text {
    switch (abTests.find(func(t : AbTestInternal) : Bool { t.id == testId })) {
      case null { "A" };
      case (?t) {
        // Balance impressions: return the variant with fewer impressions
        if (t.impressionsA <= t.impressionsB) { "A" } else { "B" };
      };
    };
  };

  // ── Admin Activity Heatmap ────────────────────────────────────────────────

  /// Record admin activity at (dayOfWeek, hour) granularity.
  /// dayOfWeek: 0=Sun..6=Sat derived from Unix nanoseconds approximation.
  public func recordAdminActivity(
    activityMap : Map.Map<Text, Nat>,
    action : Text,
  ) {
    let now = Time.now(); // nanoseconds
    let secondsSinceEpoch = now / 1_000_000_000;
    let hour : Nat = (secondsSinceEpoch / 3600 % 24).toNat();
    let dayOfWeek : Nat = ((secondsSinceEpoch / 86400 + 4) % 7).toNat(); // epoch day 0 = Thursday, +4 shifts to Sunday=0
    let key = dayOfWeek.toText() # "-" # hour.toText() # "-" # action;
    let current = switch (activityMap.get(key)) {
      case (?n) { n };
      case null { 0 };
    };
    activityMap.add(key, current + 1);
  };

  public func getAdminActivityHeatmap(activityMap : Map.Map<Text, Nat>) : [ActivityEntry] {
    // Aggregate by (dayOfWeek, hour) across all actions
    let aggMap = Map.empty<Text, Nat>();
    activityMap.forEach(func(key : Text, count : Nat) {
      // key format: "dayOfWeek-hour-action" — extract first two parts
      let parts = key.split(#char '-');
      let partsArr = parts.toArray();
      if (partsArr.size() >= 2) {
        let aggKey = partsArr[0] # "-" # partsArr[1];
        let existing = switch (aggMap.get(aggKey)) {
          case (?n) { n };
          case null { 0 };
        };
        aggMap.add(aggKey, existing + count);
      };
    });
    aggMap.entries().map<(Text, Nat), ActivityEntry>(func((aggKey, count) : (Text, Nat)) : ActivityEntry {
      let parts = aggKey.split(#char '-').toArray();
      let dow : Nat = switch (Nat.fromText(parts[0])) { case (?n) n; case null 0 };
      let hr : Nat = if (parts.size() > 1) {
        switch (Nat.fromText(parts[1])) { case (?n) n; case null 0 };
      } else { 0 };
      { hour = hr; dayOfWeek = dow; count };
    }).toArray();
  };

  // ── Signal Performance Stats ──────────────────────────────────────────────

  public func getSignalPerformanceStats(signals : List.List<SignalTypes.Signal>) : SignalPerformanceStats {
    var totalSignals = 0;
    var wins = 0;
    var losses = 0;
    var pending = 0;
    let assetMap = Map.empty<Text, (Nat, Nat)>(); // asset -> (wins, losses)
    // For weekly trend: track by day name (Mon..Sun) using day-of-week approximation
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let dayWins = Map.empty<Text, Nat>();
    let dayLosses = Map.empty<Text, Nat>();

    signals.forEach(func(s : SignalTypes.Signal) {
      if (not s.isDraft) {
        totalSignals += 1;
        switch (s.result) {
          case (#Win) {
            wins += 1;
            // Asset stats
            let (aw, al) = switch (assetMap.get(s.asset)) {
              case (?pair) pair;
              case null (0, 0);
            };
            assetMap.add(s.asset, (aw + 1, al));
          };
          case (#Loss) {
            losses += 1;
            let (aw, al) = switch (assetMap.get(s.asset)) {
              case (?pair) pair;
              case null (0, 0);
            };
            assetMap.add(s.asset, (aw, al + 1));
          };
          case (#Active) { pending += 1 };
          case (#Expired) {};
        };
      };
    });

    let winRate : Float = if (totalSignals == 0) {
      0.0;
    } else {
      wins.toFloat() / totalSignals.toFloat() * 100.0;
    };

    let topAssets = assetMap.entries().map(
      func((asset, (aw, al)) : (Text, (Nat, Nat))) : AssetStats {
        { asset; wins = aw; losses = al };
      }
    ).toArray();

    // Build weekly trend from day names with zero defaults
    let weeklyTrend = dayNames.map(func(day : Text) : DayStats {
      let w = switch (dayWins.get(day)) { case (?n) n; case null 0 };
      let l = switch (dayLosses.get(day)) { case (?n) n; case null 0 };
      { day; wins = w; losses = l };
    });

    { totalSignals; wins; losses; pending; winRate; topAssets; weeklyTrend };
  };
};
