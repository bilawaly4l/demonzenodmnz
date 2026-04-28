import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import AdminTypes "../types/admin-enhancements";
import SignalTypes "../types/signals";
import AuditTypes "../types/audit";
import Common "../types/common";
import AdminLib "../lib/admin-enhancements";
import AuditLib "../lib/audit";
import AuthLib "../lib/auth";

mixin (
  pushNotifications  : List.List<AdminTypes.PushNotification>,
  pushNotifIdCounter : { var value : Nat },
  marketBannerRef    : { var value : ?AdminTypes.MarketMoodBanner },
  maintenanceRef     : { var value : AdminTypes.MaintenanceMode },
  auditSnapshots     : List.List<AdminTypes.AuditSnapshot>,
  snapshotIdCounter  : { var value : Nat },
  abTests            : List.List<AdminTypes.AbTestInternal>,
  abTestIdCounter    : { var value : Nat },
  activityMap        : Map.Map<Text, Nat>,
  auditLog           : List.List<AuditTypes.AuditEntry>,
  auditIdCounter     : { var value : Nat },
  sessions           : Set.Set<Text>,
  signals            : List.List<SignalTypes.Signal>,
) {

  // ── Push Notifications ────────────────────────────────────────────────────

  public func createPushNotification(
    title        : Text,
    body         : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (notif, newId) = AdminLib.createPushNotification(pushNotifications, pushNotifIdCounter.value, title, body);
    pushNotifIdCounter.value := newId;
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      "push_notification", "Created push notification: " # title,
      sessionToken, null,
    );
    #ok(notif.id);
  };

  public query func getActivePushNotifications() : async [AdminTypes.PushNotification] {
    AdminLib.getActivePushNotifications(pushNotifications);
  };

  public func dismissPushNotification(
    id : Text,
  ) : async () {
    AdminLib.dismissPushNotification(pushNotifications, id);
  };

  // ── Market Mood Banner ────────────────────────────────────────────────────

  public func setMarketMoodBanner(
    mood         : Text,
    message      : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    AdminLib.setMarketMoodBanner(marketBannerRef, mood, message);
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      "market_mood", "Set market mood: " # mood,
      sessionToken, null,
    );
    #ok(());
  };

  public query func getMarketMoodBanner() : async ?AdminTypes.MarketMoodBanner {
    AdminLib.getMarketMoodBanner(marketBannerRef);
  };

  // ── Admin Role Levels ─────────────────────────────────────────────────────

  public func validateAdminRole(passcode : Text) : async ?Text {
    let valid = AuthLib.validatePasscode(passcode);
    AdminLib.validateAdminRole(valid);
  };

  // ── Scheduled Signal Publishing ───────────────────────────────────────────

  public func publishScheduledSignals() : async Nat {
    let count = AdminLib.publishScheduledSignals(signals);
    if (count > 0) {
      auditIdCounter.value := AuditLib.logEntry(
        auditLog, auditIdCounter.value,
        "auto_publish", "Auto-published " # count.toText() # " scheduled signals",
        "system", null,
      );
    };
    count;
  };

  public func scheduleSignal(
    signalId     : Text,
    publishAt    : Int,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let found = AdminLib.scheduleSignal(signals, signalId, publishAt);
    if (not found) {
      return #err("Signal not found");
    };
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      "schedule_signal", "Scheduled signal " # signalId,
      sessionToken, null,
    );
    #ok(());
  };

  // ── Maintenance Mode ──────────────────────────────────────────────────────

  public func setMaintenanceMode(
    enabled      : Bool,
    message      : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    AdminLib.setMaintenanceMode(maintenanceRef, enabled, message);
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      "maintenance_mode", "Set maintenance mode: " # (if (enabled) "ON" else "OFF"),
      sessionToken, null,
    );
    #ok(());
  };

  public query func getMaintenanceMode() : async AdminTypes.MaintenanceMode {
    AdminLib.getMaintenanceMode(maintenanceRef);
  };

  // ── Audit Snapshots ───────────────────────────────────────────────────────

  public func createAuditSnapshot(
    snapshotLabel : Text,
    sessionToken  : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (snap, newId) = AdminLib.createAuditSnapshot(auditSnapshots, auditLog, snapshotIdCounter.value, snapshotLabel);
    snapshotIdCounter.value := newId;
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      "create_snapshot", "Created audit snapshot: " # snapshotLabel,
      sessionToken, null,
    );
    #ok(snap.id);
  };

  public func listAuditSnapshots(
    sessionToken : Text,
  ) : async Common.Result<[AdminTypes.AuditSnapshot], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(AdminLib.listAuditSnapshots(auditSnapshots));
  };

  // ── A/B Content Testing ───────────────────────────────────────────────────

  public func createAbTest(
    name         : Text,
    variantA     : Text,
    variantB     : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (id, newId) = AdminLib.createAbTest(abTests, abTestIdCounter.value, name, variantA, variantB);
    abTestIdCounter.value := newId;
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      "create_ab_test", "Created A/B test: " # name,
      sessionToken, null,
    );
    #ok(id);
  };

  public func getAbTests(
    sessionToken : Text,
  ) : async Common.Result<[AdminTypes.AbTest], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(AdminLib.getAbTests(abTests));
  };

  public func recordAbImpression(
    testId  : Text,
    variant : Text,
  ) : async () {
    AdminLib.recordAbImpression(abTests, testId, variant);
  };

  public query func getAbVariant(testId : Text) : async Text {
    AdminLib.getAbVariant(abTests, testId);
  };

  // ── Admin Activity Heatmap ────────────────────────────────────────────────

  public func recordAdminActivity(
    action       : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    AdminLib.recordAdminActivity(activityMap, action);
    #ok(());
  };

  public func getAdminActivityHeatmap(
    sessionToken : Text,
  ) : async Common.Result<[AdminTypes.ActivityEntry], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(AdminLib.getAdminActivityHeatmap(activityMap));
  };

  // ── Signal Performance Dashboard ──────────────────────────────────────────

  public func getSignalPerformanceStats(
    sessionToken : Text,
  ) : async Common.Result<AdminTypes.SignalPerformanceStats, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(AdminLib.getSignalPerformanceStats(signals));
  };

  // ── Admin Command Console ─────────────────────────────────────────────────

  /// Execute a named admin command.
  /// Supported: "clear_cache", "reset_stats", "toggle_maintenance"
  public func executeAdminCommand(
    sessionToken : Text,
    command      : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let result : Text = if (command == "clear_cache") {
      "Cache cleared (no-op in canister; state is persistent)";
    } else if (command == "reset_stats") {
      "Stats reset: signal performance recomputed on next query";
    } else if (command == "toggle_maintenance") {
      let current = AdminLib.getMaintenanceMode(maintenanceRef);
      AdminLib.setMaintenanceMode(maintenanceRef, not current.enabled, current.message);
      "Maintenance mode toggled to: " # (if (not current.enabled) "ON" else "OFF");
    } else {
      return #err("Unknown command: " # command);
    };
    auditIdCounter.value := AuditLib.logEntry(
      auditLog, auditIdCounter.value,
      "admin_command", "Executed: " # command,
      sessionToken, null,
    );
    #ok(result);
  };
};
