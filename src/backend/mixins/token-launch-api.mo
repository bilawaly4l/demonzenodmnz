import Set "mo:core/Set";
import List "mo:core/List";
import TokenLaunchTypes "../types/token-launch";
import SignalTypes "../types/signals";
import Common "../types/common";
import TokenLaunchLib "../lib/token-launch";
import AuthLib "../lib/auth";
import Time "mo:core/Time";

mixin (
  sessions          : Set.Set<Text>,
  whitepaperRef     : { var value : TokenLaunchLib.WhitepaperContent },
  holderBenefits    : List.List<TokenLaunchLib.HolderBenefit>,
  benefitsSeeded    : { var value : Bool },
  signalOfWeekRef   : { var value : ?TokenLaunchLib.SignalOfWeek },
  signals           : List.List<SignalTypes.Signal>,
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
    // Format weekOf as ISO week string using epoch time (simple approach)
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
};
