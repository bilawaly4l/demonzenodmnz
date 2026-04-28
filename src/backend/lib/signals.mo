import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/signals";
import Common "../types/common";

module {
  public type Signal = Types.Signal;
  public type SignalInput = Types.SignalInput;
  public type SignalTemplate = Types.SignalTemplate;
  public type MarketType = Types.MarketType;
  public type Direction = Types.Direction;
  public type ResultStatus = Types.ResultStatus;
  public type Confidence = Types.Confidence;
  public type Timeframe = Types.Timeframe;
  public type Result<T, E> = Common.Result<T, E>;

  public func addSignal(
    signals : List.List<Signal>,
    nextId : Nat,
    asset : Text,
    marketType : MarketType,
    direction : Direction,
    entryPrice : Text,
    targetPrice : Text,
    stopLoss : Text,
    tp1 : Text,
    tp2 : Text,
    tp3 : Text,
    notes : Text,
    confidence : Confidence,
    sourceLabel : Text,
    providerLabel : Text,
    expiry : ?Int,
    timeframe : Timeframe,
    isDraft : Bool,
    publishAt : ?Int,
    templateId : ?Text,
    tags : [Text],
  ) : (Signal, Nat) {
    let now = Time.now();
    let datePosted = now.toText();
    let signal : Signal = {
      id = nextId.toText();
      asset;
      marketType;
      direction;
      entryPrice;
      targetPrice;
      stopLoss;
      tp1;
      tp2;
      tp3;
      datePosted;
      result = #Active;
      notes;
      confidence;
      sourceLabel;
      providerLabel;
      expiry;
      timeframe;
      isDraft;
      publishAt;
      templateId;
      voteUp = 0;
      voteDown = 0;
      tags;
    };
    signals.add(signal);
    (signal, nextId + 1);
  };

  public func updateSignal(
    signals : List.List<Signal>,
    id : Text,
    asset : Text,
    marketType : MarketType,
    direction : Direction,
    entryPrice : Text,
    targetPrice : Text,
    stopLoss : Text,
    tp1 : Text,
    tp2 : Text,
    tp3 : Text,
    notes : Text,
    confidence : Confidence,
    sourceLabel : Text,
    providerLabel : Text,
    expiry : ?Int,
    timeframe : Timeframe,
    isDraft : Bool,
    publishAt : ?Int,
    templateId : ?Text,
    tags : [Text],
  ) : Result<Signal, Text> {
    var found = false;
    var updated : Signal = blankSignal();
    signals.mapInPlace(func(s) {
      if (s.id == id) {
        found := true;
        let u : Signal = {
          s with
          asset;
          marketType;
          direction;
          entryPrice;
          targetPrice;
          stopLoss;
          tp1;
          tp2;
          tp3;
          notes;
          confidence;
          sourceLabel;
          providerLabel;
          expiry;
          timeframe;
          isDraft;
          publishAt;
          templateId;
          tags;
        };
        updated := u;
        u;
      } else { s };
    });
    if (found) { #ok(updated) } else { #err("Signal not found: " # id) };
  };

  public func deleteSignal(
    signals : List.List<Signal>,
    id : Text,
  ) : Result<(), Text> {
    let sizeBefore = signals.size();
    let kept = signals.filter(func(s) { s.id != id });
    signals.clear();
    signals.addAll(kept.values());
    if (signals.size() < sizeBefore) { #ok(()) } else { #err("Signal not found: " # id) };
  };

  public func updateSignalResult(
    signals : List.List<Signal>,
    id : Text,
    result : ResultStatus,
  ) : Result<Signal, Text> {
    var found = false;
    var updated : Signal = blankSignal();
    signals.mapInPlace(func(s) {
      if (s.id == id) {
        found := true;
        let u : Signal = { s with result };
        updated := u;
        u;
      } else { s };
    });
    if (found) { #ok(updated) } else { #err("Signal not found: " # id) };
  };

  public func voteOnSignal(
    signals : List.List<Signal>,
    id : Text,
    direction : Text,
  ) : Result<(), Text> {
    var found = false;
    signals.mapInPlace(func(s) {
      if (s.id == id) {
        found := true;
        if (direction == "up") {
          { s with voteUp = s.voteUp + 1 };
        } else if (direction == "down") {
          { s with voteDown = s.voteDown + 1 };
        } else { s };
      } else { s };
    });
    if (found) { #ok(()) } else { #err("Signal not found: " # id) };
  };

  public func addSignalNote(
    signals : List.List<Signal>,
    id : Text,
    note : Text,
  ) : Result<(), Text> {
    var found = false;
    signals.mapInPlace(func(s) {
      if (s.id == id) {
        found := true;
        let combined = if (s.notes == "") { note } else { s.notes # "\n" # note };
        { s with notes = combined };
      } else { s };
    });
    if (found) { #ok(()) } else { #err("Signal not found: " # id) };
  };

  /// Returns only published signals for public API.
  /// Draft signals and signals with publishAt in the future are excluded.
  /// Expired signals (expiry < now) have their result overridden to #Expired.
  public func getSignals(signals : List.List<Signal>, now : Int) : [Signal] {
    signals.filterMap<Signal, Signal>(func(s) {
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

  /// Returns all signals including drafts and scheduled (admin only)
  public func getScheduledSignals(signals : List.List<Signal>) : [Signal] {
    signals.toArray();
  };

  /// Update draft/schedule fields only
  public func updateSignalSchedule(
    signals : List.List<Signal>,
    id : Text,
    isDraft : Bool,
    publishAt : ?Int,
  ) : Result<Signal, Text> {
    var found = false;
    var updated : Signal = blankSignal();
    signals.mapInPlace(func(s) {
      if (s.id == id) {
        found := true;
        let u : Signal = { s with isDraft; publishAt };
        updated := u;
        u;
      } else { s };
    });
    if (found) { #ok(updated) } else { #err("Signal not found: " # id) };
  };

  /// Bulk import: add multiple signals from SignalInput, returns created signals
  public func importSignals(
    signals : List.List<Signal>,
    nextId : Nat,
    inputs : [SignalInput],
  ) : ([Signal], Nat) {
    var currentId = nextId;
    let created = List.empty<Signal>();
    for (inp in inputs.values()) {
      let now = Time.now();
      let s : Signal = {
        id = currentId.toText();
        asset = inp.asset;
        marketType = inp.marketType;
        direction = inp.direction;
        entryPrice = inp.entryPrice;
        targetPrice = inp.targetPrice;
        stopLoss = inp.stopLoss;
        tp1 = inp.tp1;
        tp2 = inp.tp2;
        tp3 = inp.tp3;
        datePosted = now.toText();
        result = #Active;
        notes = inp.notes;
        confidence = inp.confidence;
        sourceLabel = inp.sourceLabel;
        providerLabel = inp.providerLabel;
        expiry = inp.expiry;
        timeframe = inp.timeframe;
        isDraft = inp.isDraft;
        publishAt = inp.publishAt;
        templateId = inp.templateId;
        voteUp = 0;
        voteDown = 0;
        tags = inp.tags;
      };
      signals.add(s);
      created.add(s);
      currentId += 1;
    };
    (created.toArray(), currentId);
  };

  // ── Signal Templates ─────────────────────────────────────────────────────

  public func addSignalTemplate(
    templates : List.List<SignalTemplate>,
    nextId : Nat,
    name : Text,
    asset : Text,
    marketType : MarketType,
    direction : Direction,
    timeframe : Timeframe,
    confidence : Confidence,
    notes : Text,
  ) : (SignalTemplate, Nat) {
    let id = "tmpl-" # nextId.toText();
    let tmpl : SignalTemplate = {
      id;
      name;
      asset;
      marketType;
      direction;
      timeframe;
      confidence;
      notes;
      createdAt = Time.now();
    };
    templates.add(tmpl);
    (tmpl, nextId + 1);
  };

  public func getSignalTemplates(templates : List.List<SignalTemplate>) : [SignalTemplate] {
    templates.toArray();
  };

  public func deleteSignalTemplate(templates : List.List<SignalTemplate>, id : Text) : Result<(), Text> {
    let before = templates.size();
    let kept = templates.filter(func(t) { t.id != id });
    templates.clear();
    templates.addAll(kept.values());
    if (templates.size() < before) { #ok(()) } else { #err("Template not found: " # id) };
  };

  // ── Internal helpers ──────────────────────────────────────────────────────

  func blankSignal() : Signal {
    {
      id = "";
      asset = "";
      marketType = #Crypto;
      direction = #Buy;
      entryPrice = "";
      targetPrice = "";
      stopLoss = "";
      tp1 = "";
      tp2 = "";
      tp3 = "";
      datePosted = "";
      result = #Active;
      notes = "";
      confidence = #Medium;
      sourceLabel = "";
      providerLabel = "";
      expiry = null;
      timeframe = #Swing;
      isDraft = false;
      publishAt = null;
      templateId = null;
      voteUp = 0;
      voteDown = 0;
      tags = [];
    };
  };
};
