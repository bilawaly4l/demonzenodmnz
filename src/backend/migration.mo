import List "mo:core/List";
import RoadmapTypes "types/roadmap";

/// Explicit migration: drops all old academy / admin / referral / zeno-ai stable fields.
/// Only roadmapMilestones is preserved and forwarded to the new actor.
module {
  // ── Internal List type (opaque internal structure from mo:core) ────────────
  type ListInternal<T> = List.List<T>;

  // ── Old inline types (copied from .old/src/backend to avoid import path issues) ─
  type OldCertificateInfo = {
    city        : Text;
    country     : Text;
    dateOfBirth : Text;
    email       : Text;
    fathersName : Text;
    fullName    : Text;
  };
  type OldCertificate = {
    certId         : Text;
    certInfo       : OldCertificateInfo;
    featured       : Bool;
    isValid        : Bool;
    issuedAt       : Int;
    score          : Nat;
    shareToken     : Text;
    tierId         : Text;
    tierName       : Text;
    totalQuestions : Nat;
  };
  type OldQuizAttemptStats    = { tierId : Text; totalAttempts : Nat; passCount : Nat };
  type OldAnnouncementBanner  = { isPinned : Bool; text : Text; updatedAt : Int };
  type OldQuestionFailStat    = { failCount : Nat; questionId : Text; tierId : Text; totalSeen : Nat };
  type OldQuizAttemptLog      = { fingerprint : Text; passed : Bool; score : Nat; tierId : Text; timestamp : Int };
  type OldTierDisabledEntry   = { disabled : Bool; tierId : Text };
  type OldLessonRating        = { lessonId : Text; rating : Nat; tierId : Text; timestamp : Int };
  type OldDailyActiveLog      = { count : Nat; date : Text };
  type OldLessonCompletionLog = { completedAt : Int; lessonId : Text; tierId : Text };
  type OldTierFailMessage     = { message : Text; tierId : Text };
  type OldTierFeaturedLesson  = { lessonId : Text; tierId : Text };
  type OldMasteryRecord       = {
    conceptCheckerScore : Float;
    confidenceScore     : Float;
    lessonId            : Text;
    masteryPct          : Float;
    quizScore           : Float;
    tier                : Text;
    updatedAt           : Int;
  };
  type OldMonthlyLessonEvent  = { lessonId : Text; month : Text };
  type OldProgressSnapshot    = {
    certificatesEarned : [Text];
    createdAt          : Int;
    masteryLevels      : [(Text, Float)];
    shareToken         : Text;
    tiersCompleted     : [Text];
  };
  type OldLessonOfWeek        = { expiresAt : Int; lessonId : Text; lessonTitle : Text; setAt : Int; tier : Text };
  type OldABTestRecord        = {
    activeVersion     : Text;
    questionId        : Text;
    versionAAttempts  : Nat;
    versionAPassCount : Nat;
    versionAText      : Text;
    versionBAttempts  : Nat;
    versionBPassCount : Nat;
    versionBText      : Text;
  };
  type OldLessonEngagement    = { lessonId : Text; tier : Text; totalTimeSeconds : Nat; visitCount : Nat };
  type OldAdminAction         = {
    #bulkRevoked          : { count : Nat };
    #clearedLog           : {};
    #disabledTier         : { tierId : Text };
    #editedLesson         : { lessonId : Text; tierId : Text };
    #enabledTier          : { tierId : Text };
    #featuredCertificate  : { certId : Text; featured : Bool };
    #flaggedQuestion      : { questionId : Text; tierId : Text };
    #issuedCertificate    : { certId : Text; recipientName : Text; tierName : Text };
    #removedSchedule      : { lessonId : Nat; tierId : Nat };
    #revokedCertificate   : { certId : Text };
    #scheduledLesson      : { goLiveDate : Int; lessonId : Nat; tierId : Nat };
    #setAnnouncement      : { text : Text };
  };
  type OldAdminActivityEntry  = { action : OldAdminAction; id : Nat; timestamp : Int };
  type OldDripSchedule        = { goLiveDate : Int; lessonId : Nat; tierId : Nat };
  type OldReferralRecord      = { code : Text; createdAt : Int; referees : [Text]; referrerName : Text };
  type OldRoadmapMilestone    = RoadmapTypes.RoadmapMilestone;

  // ── OldActor: all 25 stable fields from the previous deployed version ──────
  type OldActor = {
    ADMIN_PASSCODE       : Text;
    abTests              : ListInternal<OldABTestRecord>;
    adminLog             : ListInternal<OldAdminActivityEntry>;
    adminLogIdCounter    : { var value : Nat };
    announcementBanner   : { var banner : ?OldAnnouncementBanner };
    attemptLogs          : ListInternal<OldQuizAttemptLog>;
    attemptStats         : ListInternal<OldQuizAttemptStats>;
    certIdCounter        : { var value : Nat };
    certificates         : ListInternal<OldCertificate>;
    dailyActiveLogs      : ListInternal<OldDailyActiveLog>;
    disabledTiers        : ListInternal<OldTierDisabledEntry>;
    dripSchedules        : ListInternal<OldDripSchedule>;
    engagements          : ListInternal<OldLessonEngagement>;
    flaggedQuestions     : ListInternal<Text>;
    lessonCompletionLogs : ListInternal<OldLessonCompletionLog>;
    lessonOfWeekHolder   : { var item : ?OldLessonOfWeek };
    lessonRatings        : ListInternal<OldLessonRating>;
    masteryRecords       : ListInternal<OldMasteryRecord>;
    monthlyEvents        : ListInternal<OldMonthlyLessonEvent>;
    progressSnapshots    : ListInternal<OldProgressSnapshot>;
    questionFailStats    : ListInternal<OldQuestionFailStat>;
    referralRecords      : ListInternal<OldReferralRecord>;
    roadmapMilestones    : ListInternal<OldRoadmapMilestone>;
    shareSnapshotCounter : { var value : Nat };
    tierFailMessages     : ListInternal<OldTierFailMessage>;
    tierFeaturedLessons  : ListInternal<OldTierFeaturedLesson>;
  };

  // ── NewActor: only roadmapMilestones survives ──────────────────────────────
  type NewActor = {
    roadmapMilestones : ListInternal<RoadmapTypes.RoadmapMilestone>;
  };

  /// Migration function: consume all old fields, keep only roadmapMilestones.
  public func run(old : OldActor) : NewActor {
    { roadmapMilestones = old.roadmapMilestones }
  };
};
