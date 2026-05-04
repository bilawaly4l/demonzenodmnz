module {
  /// A single referral record linking a referrer code to referred learners
  public type ReferralRecord = {
    code        : Text;   // unique referral code (e.g. "DMNZ-ABCD1")
    referrerName : Text;
    referees    : [Text]; // names of people who used this code
    createdAt   : Int;
  };

  /// Public view of a referral record for the referral wall
  public type ReferralWallEntry = {
    referrerName : Text;
    code         : Text;
    referralCount : Nat;
    createdAt    : Int;
  };
};
