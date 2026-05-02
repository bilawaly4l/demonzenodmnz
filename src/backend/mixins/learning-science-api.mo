import List "mo:core/List";
import LearningLib "../lib/learning-science";
import Types "../types/academy";
import Runtime "mo:core/Runtime";

/// Public API mixin for learning-science features.
/// Receives all required state slices from main.mo.
mixin (
  masteryRecords   : List.List<Types.MasteryRecord>,
  monthlyEvents    : List.List<Types.MonthlyLessonEvent>,
  shareSnapshotCounter : { var value : Nat },
  progressSnapshots : List.List<Types.ProgressSnapshot>,
  lessonOfWeekHolder : { var item : ?Types.LessonOfWeek },
  abTests          : List.List<Types.ABTestRecord>,
  engagements      : List.List<Types.LessonEngagement>,
) {

  let ADMIN_PASSCODE : Text = "2420075112009BILAWALPRAKRITI";

  // ── Mastery ─────────────────────────────────────────────────────────────────

  public func updateLessonMastery(
    lessonId           : Text,
    tier               : Text,
    confidenceScore    : Float,
    conceptCheckerScore : Float,
    quizScore          : Float,
  ) : async () {
    LearningLib.upsertMastery(
      masteryRecords, lessonId, tier,
      confidenceScore, conceptCheckerScore, quizScore,
    );
  };

  public query func getLessonMastery(lessonId : Text) : async ?Types.MasteryRecord {
    LearningLib.getMastery(masteryRecords, lessonId)
  };

  public query func getAllMasteryRecords() : async [Types.MasteryRecord] {
    masteryRecords.toArray()
  };

  // ── Monthly Challenge ────────────────────────────────────────────────────────

  public func recordLessonCompleted(lessonId : Text) : async Types.MonthlyChallenge {
    let month = currentMonth();
    LearningLib.recordCompletion(monthlyEvents, month, lessonId)
  };

  public query func getMonthlyChallenge(month : Text) : async ?Types.MonthlyChallenge {
    LearningLib.getChallenge(monthlyEvents, month)
  };

  public query func adminGetMonthlyStats(passcode : Text) : async [(Text, Nat)] {
    if (passcode != ADMIN_PASSCODE) Runtime.trap("Unauthorized");
    LearningLib.monthlyStats(monthlyEvents)
  };

  // ── Study-Partner Share Links ─────────────────────────────────────────────────

  public func generateProgressShareLink(
    tiersCompleted     : [Text],
    certificatesEarned : [Text],
    masteryLevels      : [(Text, Float)],
  ) : async Text {
    let token = LearningLib.makeShareToken(shareSnapshotCounter);
    LearningLib.storeSnapshot(
      progressSnapshots, token,
      tiersCompleted, certificatesEarned, masteryLevels,
    );
    token
  };

  public query func getProgressSnapshot(shareToken : Text) : async ?Types.ProgressSnapshot {
    LearningLib.getSnapshot(progressSnapshots, shareToken)
  };

  // ── Lesson of the Week ───────────────────────────────────────────────────────

  public func adminSetLessonOfWeek(
    passcode    : Text,
    lessonId    : Text,
    lessonTitle : Text,
    tier        : Text,
  ) : async () {
    if (passcode != ADMIN_PASSCODE) Runtime.trap("Unauthorized");
    LearningLib.setLessonOfWeek(lessonOfWeekHolder, lessonId, lessonTitle, tier);
  };

  public query func getLessonOfWeek() : async ?Types.LessonOfWeek {
    LearningLib.getLessonOfWeek(lessonOfWeekHolder)
  };

  // ── A/B Quiz Testing ─────────────────────────────────────────────────────────

  public func adminCreateABTest(
    passcode   : Text,
    questionId : Text,
    versionAText : Text,
    versionBText : Text,
  ) : async () {
    if (passcode != ADMIN_PASSCODE) Runtime.trap("Unauthorized");
    LearningLib.createABTest(abTests, questionId, versionAText, versionBText);
  };

  public query func adminGetABTests(passcode : Text) : async [Types.ABTestRecord] {
    if (passcode != ADMIN_PASSCODE) Runtime.trap("Unauthorized");
    abTests.toArray()
  };

  public func adminToggleABVersion(passcode : Text, questionId : Text) : async () {
    if (passcode != ADMIN_PASSCODE) Runtime.trap("Unauthorized");
    LearningLib.toggleABVersion(abTests, questionId);
  };

  public func recordABTestResult(
    questionId : Text,
    version    : Text,
    passed     : Bool,
  ) : async () {
    LearningLib.recordABResult(abTests, questionId, version, passed);
  };

  // ── Engagement Tracking ──────────────────────────────────────────────────────

  public func recordLessonTime(
    lessonId    : Text,
    tier        : Text,
    timeSeconds : Nat,
  ) : async () {
    LearningLib.recordTime(engagements, lessonId, tier, timeSeconds);
  };

  public query func adminGetEngagementData(passcode : Text) : async [Types.LessonEngagement] {
    if (passcode != ADMIN_PASSCODE) Runtime.trap("Unauthorized");
    engagements.toArray()
  };

  // ── Private helper ────────────────────────────────────────────────────────────

  /// Returns current month as "YYYY-MM" derived from the IC clock.
  /// The IC Time.now() returns nanoseconds since Unix epoch.
  private func currentMonth() : Text {
    let ns = Time.now();
    let secs : Int = ns / 1_000_000_000;
    // Days since epoch
    let days = secs / 86400;
    // Approximate year/month via Julian day arithmetic (good enough for tagging)
    let z  : Int = days + 719468;
    let era : Int = (if (z >= 0) z else z - 146096) / 146097;
    let doe : Int = z - era * 146097;
    let yoe : Int = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y   : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp  : Int = (5 * doy + 2) / 153;
    let m   : Int = mp + (if (mp < 10) 3 else -9);
    let yr  : Int = y + (if (m <= 2) 1 else 0);
    let ym  = yr.toText() # "-" # (if (m < 10) "0" # m.toText() else m.toText());
    ym
  };

};
