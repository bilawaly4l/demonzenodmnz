import BurnTypes "../types/burn";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type BurnTracker      = BurnTypes.BurnTracker;
  public type BurnScheduleEntry = BurnTypes.BurnScheduleEntry;

  // ── Burn tracker ──────────────────────────────────────────────────────────

  public func getBurnTracker(ref : { var value : BurnTracker }) : BurnTracker {
    ref.value;
  };

  public func setBurnTracker(ref : { var value : BurnTracker }, data : BurnTracker) {
    ref.value := data;
  };

  // ── Burn schedule ─────────────────────────────────────────────────────────

  public func defaultBurnSchedule() : [BurnScheduleEntry] {
    [
      {
        id      = "bs1";
        date    = "Q1 2028";
        amount  = "5,000,000,000 DMNZ";
        reason  = "Initial Buyback & Burn — Phase 1: Reduce circulating supply";
        status  = "planned";
        txHash  = null;
      },
      {
        id      = "bs2";
        date    = "Q2 2028";
        amount  = "10,000,000,000 DMNZ";
        reason  = "Phase 2 Burn — Increase token price & trigger bonding curve";
        status  = "planned";
        txHash  = null;
      },
      {
        id      = "bs3";
        date    = "Q3 2028";
        amount  = "15,000,000,000 DMNZ";
        reason  = "Phase 3 Burn — Bonding curve trigger for cross-exchange listings";
        status  = "planned";
        txHash  = null;
      },
    ];
  };

  public func getBurnSchedule(schedule : List.List<BurnScheduleEntry>) : [BurnScheduleEntry] {
    schedule.toArray();
  };

  public func getPublicBurnSchedule(schedule : List.List<BurnScheduleEntry>) : [BurnScheduleEntry] {
    // Only return planned (future) and completed entries; hide admin-only pending entries
    let visible = schedule.filter(func(e) { e.status == "planned" or e.status == "completed" });
    visible.toArray();
  };

  public func addBurnEntry(
    schedule  : List.List<BurnScheduleEntry>,
    idCounter : { var value : Nat },
    date      : Text,
    amount    : Text,
    reason    : Text,
  ) : Text {
    idCounter.value += 1;
    let id = "bs" # idCounter.value.toText();
    schedule.add({ id; date; amount; reason; status = "planned"; txHash = null });
    id;
  };

  public func updateBurnEntryStatus(
    schedule : List.List<BurnScheduleEntry>,
    id       : Text,
    status   : Text,
    txHash   : ?Text,
  ) {
    schedule.mapInPlace(func(e) {
      if (e.id == id) { { e with status; txHash } } else { e };
    });
  };
};
