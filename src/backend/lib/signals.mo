import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/signals";
import Common "../types/common";

module {
  public type Signal = Types.Signal;
  public type SignalInput = Types.SignalInput;
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
    notes : Text,
    confidence : Confidence,
    sourceLabel : Text,
    expiry : ?Int,
    timeframe : Timeframe,
    isDraft : Bool,
    publishAt : ?Int,
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
      datePosted;
      result = #Active;
      notes;
      confidence;
      sourceLabel;
      expiry;
      timeframe;
      isDraft;
      publishAt;
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
    notes : Text,
    confidence : Confidence,
    sourceLabel : Text,
    expiry : ?Int,
    timeframe : Timeframe,
    isDraft : Bool,
    publishAt : ?Int,
  ) : Result<Signal, Text> {
    var found = false;
    var updated : Signal = {
      id = "";
      asset = "";
      marketType = #Crypto;
      direction = #Buy;
      entryPrice = "";
      targetPrice = "";
      stopLoss = "";
      datePosted = "";
      result = #Active;
      notes = "";
      confidence = #Medium;
      sourceLabel = "";
      expiry = null;
      timeframe = #Swing;
      isDraft = false;
      publishAt = null;
    };
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
          notes;
          confidence;
          sourceLabel;
          expiry;
          timeframe;
          isDraft;
          publishAt;
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
    var updated : Signal = {
      id = "";
      asset = "";
      marketType = #Crypto;
      direction = #Buy;
      entryPrice = "";
      targetPrice = "";
      stopLoss = "";
      datePosted = "";
      result = #Active;
      notes = "";
      confidence = #Medium;
      sourceLabel = "";
      expiry = null;
      timeframe = #Swing;
      isDraft = false;
      publishAt = null;
    };
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
    var updated : Signal = {
      id = "";
      asset = "";
      marketType = #Crypto;
      direction = #Buy;
      entryPrice = "";
      targetPrice = "";
      stopLoss = "";
      datePosted = "";
      result = #Active;
      notes = "";
      confidence = #Medium;
      sourceLabel = "";
      expiry = null;
      timeframe = #Swing;
      isDraft = false;
      publishAt = null;
    };
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
        datePosted = now.toText();
        result = #Active;
        notes = inp.notes;
        confidence = inp.confidence;
        sourceLabel = inp.sourceLabel;
        expiry = inp.expiry;
        timeframe = inp.timeframe;
        isDraft = inp.isDraft;
        publishAt = inp.publishAt;
      };
      signals.add(s);
      created.add(s);
      currentId += 1;
    };
    (created.toArray(), currentId);
  };
};
