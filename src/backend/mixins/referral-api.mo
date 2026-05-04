import List "mo:core/List";
import Common "../types/common";
import Types "../types/referrals";
import ReferralLib "../lib/referrals";

mixin (
  referralRecords : List.List<Types.ReferralRecord>,
) {
  /// Create a unique referral link for a referrer.
  /// Returns the referral code string on success.
  public func createReferralLink(referrerName : Text) : async Common.Result<Text, Text> {
    ReferralLib.createReferralLink(referralRecords, referrerName);
  };

  /// Record that a named learner used a referral code.
  public func trackReferral(code : Text, refereeName : Text) : async Common.Result<(), Text> {
    ReferralLib.trackReferral(referralRecords, code, refereeName);
  };

  /// Return the public referral wall — all referrers with their referral counts.
  public query func getReferralStats() : async [Types.ReferralWallEntry] {
    ReferralLib.getReferralStats(referralRecords);
  };

  /// Return names of everyone referred by a specific code.
  public query func getMyReferrals(code : Text) : async [Text] {
    ReferralLib.getMyReferrals(referralRecords, code);
  };
};
