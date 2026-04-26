import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import SignalTypes "../types/signals";
import AuditTypes "../types/audit";
import Common "../types/common";
import SignalsLib "../lib/signals";
import AuditLib "../lib/audit";
import AuthLib "../lib/auth";

mixin (
  signals : List.List<SignalTypes.Signal>,
  signalIdCounter : { var value : Nat },
  auditLog : List.List<AuditTypes.AuditEntry>,
  auditIdCounter : { var value : Nat },
  sessions : Set.Set<Text>,
  signalOfTheDayRef : { var value : ?Text },
) {
  public func addSignal(
    sessionToken : Text,
    asset : Text,
    marketType : SignalTypes.MarketType,
    direction : SignalTypes.Direction,
    entryPrice : Text,
    targetPrice : Text,
    stopLoss : Text,
    notes : Text,
    confidence : SignalTypes.Confidence,
    sourceLabel : Text,
    expiry : ?Int,
    timeframe : SignalTypes.Timeframe,
    isDraft : Bool,
    publishAt : ?Int,
  ) : async Common.Result<SignalTypes.Signal, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (signal, newId) = SignalsLib.addSignal(
      signals,
      signalIdCounter.value,
      asset,
      marketType,
      direction,
      entryPrice,
      targetPrice,
      stopLoss,
      notes,
      confidence,
      sourceLabel,
      expiry,
      timeframe,
      isDraft,
      publishAt,
    );
    signalIdCounter.value := newId;
    auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, "create_signal", "Created signal " # signal.id # " for " # asset);
    #ok(signal);
  };

  public func updateSignal(
    sessionToken : Text,
    id : Text,
    asset : Text,
    marketType : SignalTypes.MarketType,
    direction : SignalTypes.Direction,
    entryPrice : Text,
    targetPrice : Text,
    stopLoss : Text,
    notes : Text,
    confidence : SignalTypes.Confidence,
    sourceLabel : Text,
    expiry : ?Int,
    timeframe : SignalTypes.Timeframe,
    isDraft : Bool,
    publishAt : ?Int,
  ) : async Common.Result<SignalTypes.Signal, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let result = SignalsLib.updateSignal(signals, id, asset, marketType, direction, entryPrice, targetPrice, stopLoss, notes, confidence, sourceLabel, expiry, timeframe, isDraft, publishAt);
    switch (result) {
      case (#ok(_)) {
        auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, "update_signal", "Updated signal " # id);
      };
      case (#err(_)) {};
    };
    result;
  };

  public func deleteSignal(
    sessionToken : Text,
    id : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let result = SignalsLib.deleteSignal(signals, id);
    switch (result) {
      case (#ok(_)) {
        // Clear signal-of-the-day if it pointed at this signal
        switch (signalOfTheDayRef.value) {
          case (?sodId) { if (sodId == id) { signalOfTheDayRef.value := null } };
          case null {};
        };
        auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, "delete_signal", "Deleted signal " # id);
      };
      case (#err(_)) {};
    };
    result;
  };

  public func updateSignalResult(
    sessionToken : Text,
    id : Text,
    result : SignalTypes.ResultStatus,
  ) : async Common.Result<SignalTypes.Signal, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let res = SignalsLib.updateSignalResult(signals, id, result);
    switch (res) {
      case (#ok(_)) {
        auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, "update_result", "Updated result for signal " # id);
      };
      case (#err(_)) {};
    };
    res;
  };

  public query func getSignals() : async [SignalTypes.Signal] {
    SignalsLib.getSignals(signals, Time.now());
  };

  /// Admin: get all signals including drafts and scheduled
  public func getScheduledSignals(
    sessionToken : Text,
  ) : async Common.Result<[SignalTypes.Signal], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    #ok(SignalsLib.getScheduledSignals(signals));
  };

  /// Admin: update draft/schedule fields
  public func updateSignalSchedule(
    sessionToken : Text,
    id : Text,
    isDraft : Bool,
    publishAt : ?Int,
  ) : async Common.Result<SignalTypes.Signal, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let result = SignalsLib.updateSignalSchedule(signals, id, isDraft, publishAt);
    switch (result) {
      case (#ok(_)) {
        auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, "toggle_draft", "Updated schedule for signal " # id);
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Admin: bulk import signals
  public func importSignals(
    sessionToken : Text,
    inputs : [SignalTypes.SignalInput],
  ) : async Common.Result<[SignalTypes.Signal], Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (created, newId) = SignalsLib.importSignals(signals, signalIdCounter.value, inputs);
    signalIdCounter.value := newId;
    auditIdCounter.value := AuditLib.logEntry(
      auditLog,
      auditIdCounter.value,
      "bulk_import",
      "Bulk imported " # created.size().toText() # " signals",
    );
    #ok(created);
  };

  // ── Signal of the Day ─────────────────────────────────────────────────────

  /// Admin: set which signal is featured as Signal of the Day.
  /// If signalId is null, auto-picks the best active signal using quality heuristics
  /// (High confidence > Active result > most recent).
  public func setSignalOfTheDay(
    sessionToken : Text,
    signalId : ?Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let chosenId : Text = switch (signalId) {
      case (?id) {
        // Verify signal exists
        let found = signals.find(func(s : SignalTypes.Signal) : Bool { s.id == id });
        switch (found) {
          case null { return #err("Signal not found") };
          case (?_) id;
        };
      };
      case null {
        // Auto-pick: prefer High-confidence Active signals, then any Active
        let now = Time.now();
        let candidates = signals.filter(func(s : SignalTypes.Signal) : Bool {
          not s.isDraft and s.result == #Active and (
            switch (s.publishAt) {
              case (?at) at <= now;
              case null true;
            }
          ) and (
            switch (s.expiry) {
              case (?exp) exp > now;
              case null true;
            }
          )
        });
        // First try High confidence
        let highConf = candidates.find(func(s : SignalTypes.Signal) : Bool {
          s.confidence == #High
        });
        switch (highConf) {
          case (?s) s.id;
          case null {
            // Fall back to any candidate
            switch (candidates.first()) {
              case (?s) s.id;
              case null { return #err("No eligible active signals to auto-pick") };
            };
          };
        };
      };
    };
    signalOfTheDayRef.value := ?chosenId;
    auditIdCounter.value := AuditLib.logEntry(auditLog, auditIdCounter.value, "set_signal_of_day", "Set signal of the day: " # chosenId);
    #ok(());
  };

  /// Public: get all signals including expired ones (full archive, no drafts)
  public query func getSignalArchive() : async [SignalTypes.Signal] {
    let now = Time.now();
    signals.filterMap<SignalTypes.Signal, SignalTypes.Signal>(func(s) {
      if (s.isDraft) { return null };
      switch (s.publishAt) {
        case (?at) { if (at > now) { return null } };
        case null {};
      };
      switch (s.expiry) {
        case (?exp) {
          if (exp < now) {
            return ?{ s with result = #Expired };
          };
        };
        case null {};
      };
      ?s;
    }).toArray();
  };

  /// Public: get the current Signal of the Day (if set and published)
  public query func getSignalOfTheDay() : async ?SignalTypes.Signal {
    switch (signalOfTheDayRef.value) {
      case null null;
      case (?id) {
        let now = Time.now();
        signals.find(func(s : SignalTypes.Signal) : Bool {
          s.id == id and not s.isDraft and (
            switch (s.publishAt) {
              case (?at) at <= now;
              case null true;
            }
          )
        });
      };
    };
  };
};
