import Set "mo:core/Set";
import List "mo:core/List";
import BurnTypes "../types/burn";
import Common "../types/common";
import BurnLib "../lib/burn";
import AuthLib "../lib/auth";

mixin (
  burnRef          : { var value : BurnLib.BurnTracker },
  sessions         : Set.Set<Text>,
  burnSchedule     : List.List<BurnLib.BurnScheduleEntry>,
  burnIdCounter    : { var value : Nat },
  burnScheduleSeeded : { var value : Bool },
) {
  // ── Burn tracker ───────────────────────────────────────────────────────────

  public query func getBurnTracker() : async BurnTypes.BurnTracker {
    BurnLib.getBurnTracker(burnRef);
  };

  public func setBurnTracker(
    adminToken : Text,
    data       : BurnTypes.BurnTracker,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, adminToken)) {
      return #err("Unauthorized");
    };
    BurnLib.setBurnTracker(burnRef, data);
    #ok(());
  };

  // ── Burn schedule ──────────────────────────────────────────────────────────

  private func ensureSeeded() {
    if (not burnScheduleSeeded.value) {
      let defaults = BurnLib.defaultBurnSchedule();
      for (entry in defaults.values()) {
        burnSchedule.add(entry);
      };
      burnIdCounter.value := defaults.size();
      burnScheduleSeeded.value := true;
    };
  };

  public query func getBurnSchedule() : async [BurnTypes.BurnScheduleEntry] {
    if (not burnScheduleSeeded.value) {
      BurnLib.defaultBurnSchedule();
    } else {
      BurnLib.getBurnSchedule(burnSchedule);
    };
  };

  public query func getPublicBurnSchedule() : async [BurnTypes.BurnScheduleEntry] {
    if (not burnScheduleSeeded.value) {
      BurnLib.getPublicBurnSchedule(List.fromArray<BurnTypes.BurnScheduleEntry>(BurnLib.defaultBurnSchedule()));
    } else {
      BurnLib.getPublicBurnSchedule(burnSchedule);
    };
  };

  public func addBurnEntry(
    date         : Text,
    amount       : Text,
    reason       : Text,
    sessionToken : Text,
  ) : async Common.Result<Text, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    ensureSeeded();
    let id = BurnLib.addBurnEntry(burnSchedule, burnIdCounter, date, amount, reason);
    #ok(id);
  };

  public func updateBurnEntryStatus(
    id           : Text,
    status       : Text,
    txHash       : ?Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    ensureSeeded();
    BurnLib.updateBurnEntryStatus(burnSchedule, id, status, txHash);
    #ok(());
  };
};
