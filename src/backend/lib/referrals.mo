import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/referrals";
import List "mo:core/List";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

module {
  // Characters used to build referral codes
  let CODE_CHARS : [Char] = ['A','B','C','D','E','F','G','H','J','K','L','M',
                              'N','P','Q','R','S','T','U','V','W','X','Y','Z',
                              '2','3','4','5','6','7','8','9'];
  let CODE_LEN = 32; // length of CODE_CHARS

  /// Derive a deterministic 8-character code from the current timestamp + referrer name.
  func makeCode(referrerName : Text, existingCount : Nat) : Text {
    let seed : Int = Time.now() + existingCount.toInt();
    let chars = referrerName.toArray();
    let extra : Int = if (chars.size() > 0) (chars[0].toNat32()).toNat().toInt() else 0;
    var n : Int = (seed + extra) * 6364136223846793005 + 1442695040888963407;
    if (n < 0) { n := -n };
    var code = "";
    var i = 0;
    while (i < 8) {
      let idx = (n.toNat() % CODE_LEN);
      code := code # Text.fromChar(CODE_CHARS[idx]);
      n := (n * 6364136223846793005 + 1442695040888963407);
      if (n < 0) { n := -n };
      i := i + 1;
    };
    code;
  };

  /// Generate a new unique referral code for a named referrer.
  /// Stores the referral record and returns the code.
  public func createReferralLink(
    records      : List.List<Types.ReferralRecord>,
    referrerName : Text,
  ) : Common.Result<Text, Text> {
    if (referrerName.size() == 0) {
      return #err("Referrer name cannot be empty.");
    };
    let code = makeCode(referrerName, records.size());
    // Ensure uniqueness — if collision, append count suffix
    let duplicate = records.find(func(r : Types.ReferralRecord) : Bool { r.code == code });
    switch (duplicate) {
      case (?_) { return #err("Code collision — please try again.") };
      case null {};
    };
    records.add({
      code;
      referrerName;
      referees  = [];
      createdAt = Time.now();
    });
    #ok(code);
  };

  /// Record that someone used a referral code.
  public func trackReferral(
    records     : List.List<Types.ReferralRecord>,
    code        : Text,
    refereeName : Text,
  ) : Common.Result<(), Text> {
    switch (records.findIndex(func(r : Types.ReferralRecord) : Bool { r.code == code })) {
      case null { #err("Referral code not found.") };
      case (?idx) {
        let existing = records.at(idx);
        let updated : Types.ReferralRecord = {
          existing with
          referees = existing.referees.concat([refereeName]);
        };
        records.put(idx, updated);
        #ok(());
      };
    };
  };

  /// Return public stats for all referrers sorted by referral count descending.
  public func getReferralStats(
    records : List.List<Types.ReferralRecord>,
  ) : [Types.ReferralWallEntry] {
    let entries = records.map<Types.ReferralRecord, Types.ReferralWallEntry>(func(r) : Types.ReferralWallEntry {
      {
        referrerName  = r.referrerName;
        code          = r.code;
        referralCount = r.referees.size();
        createdAt     = r.createdAt;
      };
    }).toArray();
    // Sort descending by referral count
    entries.sort(func(a : Types.ReferralWallEntry, b : Types.ReferralWallEntry) : Order.Order {
      if (a.referralCount > b.referralCount) #less
      else if (a.referralCount < b.referralCount) #greater
      else #equal
    });
  };

  /// Return the names of everyone who used a specific referral code.
  public func getMyReferrals(
    records : List.List<Types.ReferralRecord>,
    code    : Text,
  ) : [Text] {
    switch (records.find(func(r : Types.ReferralRecord) : Bool { r.code == code })) {
      case null { [] };
      case (?r) { r.referees };
    };
  };
};
