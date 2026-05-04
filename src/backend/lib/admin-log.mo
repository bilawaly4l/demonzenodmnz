import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/admin-log";
import List "mo:core/List";

module {
  /// Append an action entry to the log.  Called internally from other mixins.
  public func logAdminAction(
    log       : List.List<Types.AdminActivityEntry>,
    idCounter : { var value : Nat },
    action    : Types.AdminAction,
  ) : () {
    idCounter.value := idCounter.value + 1;
    log.add({
      id        = idCounter.value;
      action;
      timestamp = Time.now();
    });
  };

  /// Return up to `limit` most-recent log entries (newest first).
  public func getAdminActivityLog(
    log   : List.List<Types.AdminActivityEntry>,
    limit : Nat,
  ) : [Types.AdminActivityEntry] {
    let all = log.toArray();
    let reversed = all.reverse();
    let take = if (limit == 0 or limit >= reversed.size()) reversed.size() else limit;
    reversed.sliceToArray(0, take.toInt());
  };

  /// Remove all entries from the log and append a clearedLog action.
  public func clearAdminLog(
    log       : List.List<Types.AdminActivityEntry>,
    _idCounter : { var value : Nat },
    logAction : (Types.AdminAction) -> (),
  ) : () {
    log.clear();
    logAction(#clearedLog {});
  };

  /// Store or overwrite a drip-schedule entry.
  public func setLessonGoLiveDate(
    schedules  : List.List<Types.DripSchedule>,
    tierId     : Nat,
    lessonId   : Nat,
    goLiveDate : Int,
  ) : Common.Result<(), Text> {
    switch (schedules.findIndex(func(s : Types.DripSchedule) : Bool {
      s.tierId == tierId and s.lessonId == lessonId
    })) {
      case (?idx) {
        schedules.put(idx, { tierId; lessonId; goLiveDate });
      };
      case null {
        schedules.add({ tierId; lessonId; goLiveDate });
      };
    };
    #ok(());
  };

  /// Return all scheduled go-live dates for a given tier as (lessonId, goLiveDate) pairs.
  public func getLessonGoLiveDates(
    schedules : List.List<Types.DripSchedule>,
    tierId    : Nat,
  ) : [(Nat, Int)] {
    schedules
      .filter(func(s : Types.DripSchedule) : Bool { s.tierId == tierId })
      .map<Types.DripSchedule, (Nat, Int)>(func(s) : (Nat, Int) { (s.lessonId, s.goLiveDate) })
      .toArray();
  };

  /// Remove a scheduled go-live date entry.
  public func removeLessonGoLiveDate(
    schedules : List.List<Types.DripSchedule>,
    tierId    : Nat,
    lessonId  : Nat,
  ) : Common.Result<(), Text> {
    switch (schedules.findIndex(func(s : Types.DripSchedule) : Bool {
      s.tierId == tierId and s.lessonId == lessonId
    })) {
      case null { #err("Schedule entry not found.") };
      case (?_idx) {
        // Remove by shifting elements: replace list contents without the target entry
        let all = schedules.toArray();
        schedules.clear();
        for (s in all.values()) {
          if (not (s.tierId == tierId and s.lessonId == lessonId)) {
            schedules.add(s);
          };
        };
        #ok(());
      };
    };
  };
};
