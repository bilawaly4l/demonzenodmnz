import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Types "../types/academy";

/// Domain logic for learning-science features:
/// mastery tracking, monthly challenges, study-partner share links,
/// lesson-of-the-week, A/B quiz testing, and engagement heatmap.
module {

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Derive mastery percentage from component scores.
  public func calcMasteryPct(confidence : Float, conceptChecker : Float, quiz : Float) : Float {
    (confidence * 0.3) + (conceptChecker * 0.35) + (quiz * 0.35)
  };

  /// Seven days in nanoseconds.
  public let sevenDaysNs : Int = 604_800_000_000_000;

  // ── Mastery ─────────────────────────────────────────────────────────────────

  /// Upsert a MasteryRecord for (lessonId).  Updates in place if found.
  public func upsertMastery(
    records     : List.List<Types.MasteryRecord>,
    lessonId    : Text,
    tier        : Text,
    confidence  : Float,
    conceptChecker : Float,
    quiz        : Float,
  ) {
    let pct = calcMasteryPct(confidence, conceptChecker, quiz);
    let now = Time.now();
    switch (records.findIndex(func(r) { r.lessonId == lessonId })) {
      case (?idx) {
        records.put(idx, {
          lessonId            = lessonId;
          tier                = tier;
          confidenceScore     = confidence;
          conceptCheckerScore = conceptChecker;
          quizScore           = quiz;
          masteryPct          = pct;
          updatedAt           = now;
        });
      };
      case null {
        records.add({
          lessonId            = lessonId;
          tier                = tier;
          confidenceScore     = confidence;
          conceptCheckerScore = conceptChecker;
          quizScore           = quiz;
          masteryPct          = pct;
          updatedAt           = now;
        });
      };
    };
  };

  public func getMastery(
    records  : List.List<Types.MasteryRecord>,
    lessonId : Text,
  ) : ?Types.MasteryRecord {
    records.find(func(r) { r.lessonId == lessonId })
  };

  // ── Monthly Challenge ────────────────────────────────────────────────────────

  let TARGET_LESSONS : Nat = 10;

  /// Record a lesson completion event for the given month bucket.
  /// Returns the updated MonthlyChallenge.
  public func recordCompletion(
    events   : List.List<Types.MonthlyLessonEvent>,
    month    : Text,
    lessonId : Text,
  ) : Types.MonthlyChallenge {
    events.add({ month; lessonId });
    let count = events.foldLeft(0, func(acc, e) {
      if (e.month == month) acc + 1 else acc
    });
    {
      month            = month;
      lessonsCompleted = count;
      badgeEarned      = count >= TARGET_LESSONS;
      targetLessons    = TARGET_LESSONS;
    }
  };

  public func getChallenge(
    events : List.List<Types.MonthlyLessonEvent>,
    month  : Text,
  ) : ?Types.MonthlyChallenge {
    let count = events.foldLeft(0, func(acc, e) {
      if (e.month == month) acc + 1 else acc
    });
    if (count == 0) null
    else ?{
      month            = month;
      lessonsCompleted = count;
      badgeEarned      = count >= TARGET_LESSONS;
      targetLessons    = TARGET_LESSONS;
    }
  };

  /// Admin: aggregated (month, totalCount) pairs across all events.
  public func monthlyStats(
    events : List.List<Types.MonthlyLessonEvent>,
  ) : [(Text, Nat)] {
    // Build a sorted association list
    let result = List.empty<(Text, Nat)>();
    events.forEach(func(e) {
      switch (result.findIndex(func(pair) { pair.0 == e.month })) {
        case (?idx) {
          let existing = result.at(idx);
          result.put(idx, (existing.0, existing.1 + 1));
        };
        case null {
          result.add((e.month, 1));
        };
      };
    });
    result.toArray()
  };

  // ── Study-Partner Share Links ─────────────────────────────────────────────────

  /// Generate a simple unique token from a counter + timestamp.
  public func makeShareToken(counter : { var value : Nat }) : Text {
    counter.value += 1;
    let ts = Time.now();
    "SP" # counter.value.toText() # "T" # ts.toText()
  };

  public func storeSnapshot(
    snapshots          : List.List<Types.ProgressSnapshot>,
    token              : Text,
    tiersCompleted     : [Text],
    certificatesEarned : [Text],
    masteryLevels      : [(Text, Float)],
  ) {
    snapshots.add({
      shareToken         = token;
      tiersCompleted     = tiersCompleted;
      certificatesEarned = certificatesEarned;
      masteryLevels      = masteryLevels;
      createdAt          = Time.now();
    });
  };

  public func getSnapshot(
    snapshots : List.List<Types.ProgressSnapshot>,
    token     : Text,
  ) : ?Types.ProgressSnapshot {
    snapshots.find(func(s) { s.shareToken == token })
  };

  // ── Lesson of the Week ───────────────────────────────────────────────────────

  public func setLessonOfWeek(
    holder      : { var item : ?Types.LessonOfWeek },
    lessonId    : Text,
    lessonTitle : Text,
    tier        : Text,
  ) {
    let now = Time.now();
    holder.item := ?{
      lessonId    = lessonId;
      lessonTitle = lessonTitle;
      tier        = tier;
      setAt       = now;
      expiresAt   = now + sevenDaysNs;
    };
  };

  public func getLessonOfWeek(
    holder : { var item : ?Types.LessonOfWeek },
  ) : ?Types.LessonOfWeek {
    switch (holder.item) {
      case null null;
      case (?low) {
        if (Time.now() > low.expiresAt) null
        else ?low
      };
    }
  };

  // ── A/B Quiz Testing ─────────────────────────────────────────────────────────

  public func createABTest(
    tests       : List.List<Types.ABTestRecord>,
    questionId  : Text,
    versionA    : Text,
    versionB    : Text,
  ) {
    // Remove any existing record for this questionId first
    let filtered = tests.filter(func(r) { r.questionId != questionId });
    tests.clear();
    tests.append(filtered);
    tests.add({
      questionId        = questionId;
      versionAText      = versionA;
      versionBText      = versionB;
      versionAPassCount = 0;
      versionBPassCount = 0;
      versionAAttempts  = 0;
      versionBAttempts  = 0;
      activeVersion     = "A";
    });
  };

  public func toggleABVersion(
    tests      : List.List<Types.ABTestRecord>,
    questionId : Text,
  ) {
    switch (tests.findIndex(func(r) { r.questionId == questionId })) {
      case (?idx) {
        let r = tests.at(idx);
        let next = if (r.activeVersion == "A") "B" else "A";
        tests.put(idx, { r with activeVersion = next });
      };
      case null {};
    };
  };

  public func recordABResult(
    tests      : List.List<Types.ABTestRecord>,
    questionId : Text,
    version    : Text,
    passed     : Bool,
  ) {
    switch (tests.findIndex(func(r) { r.questionId == questionId })) {
      case (?idx) {
        let r = tests.at(idx);
        let updated = if (version == "A") {
          { r with
            versionAAttempts  = r.versionAAttempts + 1;
            versionAPassCount = if (passed) r.versionAPassCount + 1 else r.versionAPassCount;
          }
        } else {
          { r with
            versionBAttempts  = r.versionBAttempts + 1;
            versionBPassCount = if (passed) r.versionBPassCount + 1 else r.versionBPassCount;
          }
        };
        tests.put(idx, updated);
      };
      case null {};
    };
  };

  // ── Lesson Engagement ────────────────────────────────────────────────────────

  public func recordTime(
    engagements : List.List<Types.LessonEngagement>,
    lessonId    : Text,
    tier        : Text,
    seconds     : Nat,
  ) {
    switch (engagements.findIndex(func(e) { e.lessonId == lessonId })) {
      case (?idx) {
        let e = engagements.at(idx);
        engagements.put(idx, { e with
          totalTimeSeconds = e.totalTimeSeconds + seconds;
          visitCount       = e.visitCount + 1;
        });
      };
      case null {
        engagements.add({
          lessonId         = lessonId;
          tier             = tier;
          totalTimeSeconds = seconds;
          visitCount       = 1;
        });
      };
    };
  };

};
