module {
  public type Result<T, E> = { #ok : T; #err : E };
  public type Timestamp = Int;

  /// Early Believer wall entry
  public type EarlyBeliever = {
    handle    : Text;
    timestamp : Timestamp;
    index     : Nat;
  };

  /// Hype wall message entry
  public type HypeMessage = {
    handle    : Text;
    message   : Text;
    timestamp : Timestamp;
  };

  /// First-100 pledge entry
  public type First100Entry = {
    handle    : Text;
    timestamp : Timestamp;
    position  : Nat;
    isOG      : Bool;
  };

  /// Pre-launch interest form entry
  public type InterestEntry = {
    handle    : Text;
    timestamp : Timestamp;
  };

  /// Community pledge entry
  public type CommunityPledge = {
    id        : Nat;
    name      : Text;
    timestamp : Timestamp;
  };

  /// Community submission / post entry
  public type CommunitySubmission = {
    id              : Nat;
    description     : Text;
    submitterHandle : Text;
    timestamp       : Timestamp;
  };

  /// Aggregated community counts
  public type CommunityStats = {
    earlyBelieverCount : Nat;
    hypeCount          : Nat;
    first100Count      : Nat;
    interestCount      : Nat;
    pledgeCount        : Nat;
    submissionCount    : Nat;
  };
};
