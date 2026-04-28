import Set "mo:core/Set";
import List "mo:core/List";
import TokenLaunchTypes "../types/token-launch";
import SignalTypes "../types/signals";
import Common "../types/common";
import TokenLaunchLib "../lib/token-launch";
import AuthLib "../lib/auth";
import Time "mo:core/Time";

mixin (
  sessions               : Set.Set<Text>,
  whitepaperRef          : { var value : TokenLaunchLib.WhitepaperContent },
  holderBenefits         : List.List<TokenLaunchLib.HolderBenefit>,
  benefitsSeeded         : { var value : Bool },
  signalOfWeekRef        : { var value : ?TokenLaunchLib.SignalOfWeek },
  signals                : List.List<SignalTypes.Signal>,
  whitepaperUrlRef       : { var value : ?Text },
  burnEvents             : List.List<TokenLaunchLib.BurnEvent>,
  burnEventIdCounter     : { var value : Nat },
  hypeMilestones         : List.List<TokenLaunchLib.HypeMilestone>,
  hypeMilestoneIdCounter : { var value : Nat },
  hypeMilestonesSeeded   : { var value : Bool },
) {
  // ── Whitepaper ─────────────────────────────────────────────────────────────

  public query func getWhitepaper() : async TokenLaunchTypes.WhitepaperContent {
    TokenLaunchLib.getWhitepaper(whitepaperRef);
  };

  public func updateWhitepaper(
    content      : TokenLaunchTypes.WhitepaperContent,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    TokenLaunchLib.updateWhitepaper(whitepaperRef, content);
    #ok(());
  };

  public query func getWhitepaperUrl() : async ?Text {
    TokenLaunchLib.getWhitepaperUrl(whitepaperUrlRef);
  };

  public func setWhitepaperUrl(
    url          : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    TokenLaunchLib.setWhitepaperUrl(whitepaperUrlRef, url);
    #ok(());
  };

  // ── Holder benefits ────────────────────────────────────────────────────────

  public query func getHolderBenefits() : async [TokenLaunchTypes.HolderBenefit] {
    if (not benefitsSeeded.value) {
      TokenLaunchLib.defaultHolderBenefits();
    } else {
      TokenLaunchLib.getHolderBenefits(holderBenefits);
    };
  };

  // ── Signal of the Week ─────────────────────────────────────────────────────

  public type SignalOfWeekFull = {
    signal     : SignalTypes.Signal;
    comment    : Text;
    weekOf     : Text;
    featuredAt : Int;
  };

  public query func getSignalOfWeek() : async ?SignalOfWeekFull {
    switch (TokenLaunchLib.getSignalOfWeek(signalOfWeekRef, signals)) {
      case null { null };
      case (?(sig, comment, weekOf, featuredAt)) {
        ?{ signal = sig; comment; weekOf; featuredAt };
      };
    };
  };

  public func setSignalOfWeek(
    signalId     : Text,
    comment      : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let now = Time.now();
    let weekOf = now.toText();
    TokenLaunchLib.setSignalOfWeek(signalOfWeekRef, signalId, comment, weekOf);
    #ok(());
  };

  public func setSignalOfWeekWithDate(
    signalId     : Text,
    comment      : Text,
    weekOf       : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    TokenLaunchLib.setSignalOfWeek(signalOfWeekRef, signalId, comment, weekOf);
    #ok(());
  };

  // ── Burn Events ────────────────────────────────────────────────────────────

  public query func getTokenBurnSchedule() : async [TokenLaunchTypes.BurnEvent] {
    TokenLaunchLib.getBurnSchedule(burnEvents);
  };

  public func addBurnEvent(
    date         : Text,
    amount       : Text,
    reason       : Text,
    sessionToken : Text,
  ) : async Common.Result<TokenLaunchTypes.BurnEvent, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    let (event, _) = TokenLaunchLib.addBurnEvent(burnEvents, burnEventIdCounter, date, amount, reason);
    #ok(event);
  };

  public func markBurnEventExecuted(
    id           : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    TokenLaunchLib.markBurnEventExecuted(burnEvents, id);
  };

  // ── Hype Milestones ────────────────────────────────────────────────────────

  func ensureHypeMilestonesSeeded() {
    if (hypeMilestonesSeeded.value) return;
    hypeMilestonesSeeded.value := true;
    let defaults = TokenLaunchLib.defaultHypeMilestones();
    for (m in defaults.values()) {
      hypeMilestones.add(m);
    };
    hypeMilestoneIdCounter.value := defaults.size();
  };

  public query func getHypeMilestones() : async [TokenLaunchTypes.HypeMilestone] {
    if (not hypeMilestonesSeeded.value) {
      TokenLaunchLib.defaultHypeMilestones();
    } else {
      TokenLaunchLib.getHypeMilestones(hypeMilestones);
    };
  };

  public func addHypeMilestone(
    title        : Text,
    targetCount  : Nat,
    sessionToken : Text,
  ) : async Common.Result<TokenLaunchTypes.HypeMilestone, Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    ensureHypeMilestonesSeeded();
    let m = TokenLaunchLib.addHypeMilestone(hypeMilestones, hypeMilestoneIdCounter, title, targetCount);
    #ok(m);
  };

  public func markHypeMilestoneAchieved(
    id           : Text,
    sessionToken : Text,
  ) : async Common.Result<(), Text> {
    if (not AuthLib.validateSession(sessions, sessionToken)) {
      return #err("Unauthorized");
    };
    TokenLaunchLib.markHypeMilestoneAchieved(hypeMilestones, id);
  };

  // ── Token Data ─────────────────────────────────────────────────────────────

  public query func getTokenData() : async TokenLaunchTypes.TokenData {
    TokenLaunchLib.defaultTokenData();
  };
};
