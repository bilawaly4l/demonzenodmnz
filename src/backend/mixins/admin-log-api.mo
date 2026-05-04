import List "mo:core/List";
import Common "../types/common";
import Types "../types/admin-log";
import AcademyTypes "../types/academy";
import AdminLogLib "../lib/admin-log";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

mixin (
  adminLog          : List.List<Types.AdminActivityEntry>,
  adminLogIdCounter : { var value : Nat },
  dripSchedules     : List.List<Types.DripSchedule>,
  certificates      : List.List<AcademyTypes.Certificate>,
) {
  // ── Internal helper — delegates to lib ──────────────────────────────────
  func _logAction(action : Types.AdminAction) : () {
    AdminLogLib.logAdminAction(adminLog, adminLogIdCounter, action);
  };

  // ── Activity log ────────────────────────────────────────────────────────

  /// Return up to `limit` most-recent admin activity log entries.
  public query func getAdminActivityLog(limit : Nat) : async [Types.AdminActivityEntry] {
    AdminLogLib.getAdminActivityLog(adminLog, limit);
  };

  /// Clear all entries from the admin activity log.
  public func clearAdminLog() : async () {
    AdminLogLib.clearAdminLog(adminLog, adminLogIdCounter, _logAction);
  };

  // ── Drip scheduling ─────────────────────────────────────────────────────

  /// Schedule a lesson to go live on a specific future date.
  public func setLessonGoLiveDate(tierId : Nat, lessonId : Nat, goLiveDate : Int) : async Common.Result<(), Text> {
    let result = AdminLogLib.setLessonGoLiveDate(dripSchedules, tierId, lessonId, goLiveDate);
    switch (result) {
      case (#ok(_)) {
        _logAction(#scheduledLesson { tierId; lessonId; goLiveDate });
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Return all scheduled go-live dates for a tier as (lessonId, goLiveDate) pairs.
  public query func getLessonGoLiveDates(tierId : Nat) : async [(Nat, Int)] {
    AdminLogLib.getLessonGoLiveDates(dripSchedules, tierId);
  };

  /// Remove a previously-scheduled go-live date.
  public func removeLessonGoLiveDate(tierId : Nat, lessonId : Nat) : async Common.Result<(), Text> {
    let result = AdminLogLib.removeLessonGoLiveDate(dripSchedules, tierId, lessonId);
    switch (result) {
      case (#ok(_)) {
        _logAction(#removedSchedule { tierId; lessonId });
      };
      case (#err(_)) {};
    };
    result;
  };

  // ── Bulk certificate operations ──────────────────────────────────────────

  /// Revoke multiple certificates in one call.  Returns the count actually revoked.
  public func bulkRevokeCertificates(certIds : [Text]) : async Common.Result<Nat, Text> {
    var count : Nat = 0;
    for (certId in certIds.values()) {
      switch (certificates.findIndex(func(c : AcademyTypes.Certificate) : Bool { c.certId == certId })) {
        case null {};
        case (?idx) {
          let existing = certificates.at(idx);
          if (existing.isValid) {
            certificates.put(idx, { existing with isValid = false });
            count := count + 1;
          };
        };
      };
    };
    _logAction(#bulkRevoked { count });
    #ok(count);
  };

  // ── Anti-duplicate certificate check ─────────────────────────────────────

  /// Return true if an active certificate for this (fullName, email, tier) already exists.
  public query func checkCertificateDuplicate(fullName : Text, email : Text, tier : Text) : async Bool {
    let nameLower  = fullName.toLower();
    let emailLower = email.toLower();
    let tierLower  = tier.toLower();
    let found = certificates.find(func(c : AcademyTypes.Certificate) : Bool {
      c.isValid and
      c.certInfo.fullName.toLower() == nameLower and
      c.certInfo.email.toLower()    == emailLower and
      c.tierId.toLower()            == tierLower
    });
    switch (found) {
      case null  { false };
      case (?_) { true  };
    };
  };

  // ── Hall of Champions ─────────────────────────────────────────────────────

  /// Return all learners who have earned certificates for all 5 tiers.
  public query func getHallOfChampions() : async [Types.ChampionRecord] {
    let allTiers : [Text] = ["beginner", "intermediate", "advanced", "expert", "master"];
    // Collect all valid certificates grouped by email (case-insensitive)
    // Build a list of unique emails first
    let seen = List.empty<Text>();
    for (c in certificates.values()) {
      if (c.isValid) {
        let em = c.certInfo.email.toLower();
        let already = seen.find(func(e : Text) : Bool { e == em });
        switch (already) {
          case null { seen.add(em) };
          case _ {};
        };
      };
    };
    // For each unique email, check if they hold all 5 tiers
    let champions = List.empty<Types.ChampionRecord>();
    for (email in seen.values()) {
      let earnedTiers = allTiers.filter(func(t : Text) : Bool {
        let hasTier = certificates.find(func(c : AcademyTypes.Certificate) : Bool {
          c.isValid and
          c.certInfo.email.toLower() == email and
          c.tierId == t
        });
        switch (hasTier) {
          case null  false;
          case (?_) true;
        };
      });
      if (earnedTiers.size() == 5) {
        // Find most recent certificate for this email to get name, country, date
        let certsForEmail = certificates.filter(func(c : AcademyTypes.Certificate) : Bool {
          c.isValid and c.certInfo.email.toLower() == email
        });
        // Pick the cert with the highest issuedAt (most recent)
        let mostRecent = switch (certsForEmail.max(func(a : AcademyTypes.Certificate, b : AcademyTypes.Certificate) : Order.Order {
          if (a.issuedAt > b.issuedAt) #greater
          else if (a.issuedAt < b.issuedAt) #less
          else #equal
        })) {
          case (?c) c;
          case null { Runtime.trap("unreachable: certsForEmail guaranteed non-empty") };
        };
        champions.add({
          fullName      = mostRecent.certInfo.fullName;
          country       = mostRecent.certInfo.country;
          dateCompleted = mostRecent.issuedAt;
          tiers         = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"];
        });
      };
    };
    champions.toArray();
  };
};
