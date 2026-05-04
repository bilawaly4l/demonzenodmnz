module {
  /// Discriminated union of every action that can be taken in the admin dashboard
  public type AdminAction = {
    #issuedCertificate    : { certId : Text; tierName : Text; recipientName : Text };
    #revokedCertificate   : { certId : Text };
    #bulkRevoked          : { count : Nat };
    #featuredCertificate  : { certId : Text; featured : Bool };
    #editedLesson         : { tierId : Text; lessonId : Text };
    #flaggedQuestion      : { questionId : Text; tierId : Text };
    #setAnnouncement      : { text : Text };
    #disabledTier         : { tierId : Text };
    #enabledTier          : { tierId : Text };
    #scheduledLesson      : { tierId : Nat; lessonId : Nat; goLiveDate : Int };
    #removedSchedule      : { tierId : Nat; lessonId : Nat };
    #clearedLog           : {};
  };

  /// A timestamped entry in the admin activity log
  public type AdminActivityEntry = {
    id        : Nat;
    action    : AdminAction;
    timestamp : Int;
  };

  /// Drip-scheduling entry: a lesson that goes live on a specific future date
  public type DripSchedule = {
    tierId     : Nat;
    lessonId   : Nat;
    goLiveDate : Int; // nanosecond timestamp
  };

  /// A learner who has earned all 5 tier certificates
  public type ChampionRecord = {
    fullName      : Text;
    country       : Text;
    dateCompleted : Int;  // timestamp when the 5th certificate was issued
    tiers         : [Text];
  };
};
