import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import AcademyTypes "../types/academy";
import AcademyLib "../lib/academy";
import Common "../types/common";

mixin (
  certificates         : List.List<AcademyTypes.Certificate>,
  certIdCounter        : { var value : Nat },
  attemptStats         : List.List<AcademyTypes.QuizAttemptStats>,
  announcementBanner   : { var banner : ?AcademyTypes.AnnouncementBanner },
  questionFailStats    : List.List<AcademyTypes.QuestionFailStat>,
  attemptLogs          : List.List<AcademyTypes.QuizAttemptLog>,
  disabledTiers        : List.List<AcademyTypes.TierDisabledEntry>,
  flaggedQuestions     : List.List<Text>,
  lessonRatings        : List.List<AcademyTypes.LessonRating>,
  dailyActiveLogs      : List.List<AcademyTypes.DailyActiveLog>,
  lessonCompletionLogs : List.List<AcademyTypes.LessonCompletionLog>,
  tierFailMessages     : List.List<AcademyTypes.TierFailMessage>,
  tierFeaturedLessons  : List.List<AcademyTypes.TierFeaturedLesson>,
) {

  // ── Quiz Retrieval ────────────────────────────────────────────────────────

  /// Returns 30 randomly selected questions from the 100+ question pool.
  /// Answer options are shuffled per-question so correct answers are evenly
  /// distributed across A/B/C/D (not biased to position B).
  /// Returns null if tier is disabled (admin maintenance mode).
  public query func getAcademyQuiz(tierId : Text, seed : Int) : async ?AcademyTypes.TierQuiz {
    if (AcademyLib.isTierDisabled(disabledTiers, tierId)) {
      return null; // tier in maintenance mode
    };
    switch (AcademyLib.getQuizPool(tierId)) {
      case null null;
      case (?pool) {
        let selected = AcademyLib.selectRandomQuestions(pool, seed);
        ?{
          tierId;
          tierName = AcademyLib.tierName(tierId);
          questions = selected;
        };
      };
    };
  };

  // ── Combined Quiz Grading + Certificate Issuance ──────────────────────────

  /// Grade quiz and, if passed (perfect score 30/30), issue a certificate.
  /// All certificates are stored globally — accessible from any device.
  /// Returns #err("DUPLICATE_CERTIFICATE") if email + tierId already issued.
  /// fingerprint: browser fingerprint or IP hash for anti-cheat logging.
  public func submitQuizAndIssueCertificate(
    tierId      : Text,
    answers     : [AcademyTypes.QuizAnswer],
    fullName    : Text,
    fathersName : Text,
    country     : Text,
    dateOfBirth : Text,
    email       : Text,
    city        : Text,
    seed        : Int,
    fingerprint : Text,
  ) : async Common.Result<AcademyTypes.Certificate, Text> {
    if (not AcademyLib.isValidTier(tierId)) {
      return #err("Invalid tier ID. Must be one of: beginner, intermediate, advanced, expert, master.");
    };
    if (AcademyLib.isTierDisabled(disabledTiers, tierId)) {
      return #err("This tier is currently under maintenance. Please try again later.");
    };
    // Grade against the selected 30 questions (same seed as was used to fetch the quiz)
    let pool = switch (AcademyLib.getQuizPool(tierId)) {
      case null { return #err("Quiz pool not found for tier.") };
      case (?p) p;
    };
    let selected = AcademyLib.selectRandomQuestions(pool, seed);
    var score : Nat = 0;
    var breakdown : [AcademyTypes.QuizBreakdownItem] = [];
    for (question in selected.values()) {
      let selectedOpt = switch (answers.find(func(a : AcademyTypes.QuizAnswer) : Bool { a.questionId == question.id })) {
        case (?a) a.selectedOption;
        case null  "";
      };
      let correct = selectedOpt == question.correctOption;
      if (correct) { score := score + 1 };
      breakdown := breakdown.concat([{ questionId = question.id; correct }]);
    };
    let passed = score == 30;
    // Track this attempt regardless of outcome
    AcademyLib.trackAttempt(attemptStats, tierId, passed);
    // Log attempt with fingerprint
    attemptLogs.add({
      tierId;
      fingerprint;
      timestamp = Time.now();
      passed;
      score;
    });
    // Record per-question fail stats
    let questionIds = selected.map(func(q) { q.id });
    AcademyLib.recordPerQuestionStats(questionFailStats, tierId, breakdown, questionIds);
    if (not passed) {
      return #err("Quiz not passed. Score: " # score.toText() # "/30. A perfect 30/30 is required to earn a certificate.");
    };
    // Validate required fields
    if (fullName.size() == 0)    { return #err("Full name is required.") };
    if (fathersName.size() == 0) { return #err("Father's name is required.") };
    if (country.size() == 0)     { return #err("Country is required.") };
    if (dateOfBirth.size() == 0) { return #err("Date of birth is required.") };
    if (email.size() == 0)       { return #err("Email is required.") };
    if (city.size() == 0)        { return #err("City is required.") };
    // Anti-duplicate check: same email + tierId combination
    let emailLower = email.toLower();
    let duplicate = certificates.find(func(c : AcademyTypes.Certificate) : Bool {
      c.certInfo.email.toLower() == emailLower and c.tierId == tierId and c.isValid
    });
    switch (duplicate) {
      case (?_existing) { return #err("DUPLICATE_CERTIFICATE") };
      case null {};
    };
    // Generate unique certificate ID and share token
    certIdCounter.value := certIdCounter.value + 1;
    let certId     = AcademyLib.generateCertId(certIdCounter.value, fullName, tierId);
    let shareToken = AcademyLib.generateShareToken(certIdCounter.value, certId);
    let cert : AcademyTypes.Certificate = {
      certId;
      shareToken;
      tierId;
      tierName       = AcademyLib.tierName(tierId);
      certInfo       = { fullName; fathersName; country; dateOfBirth; email; city };
      score;
      totalQuestions = 30;
      issuedAt       = Time.now();
      isValid        = true;
      featured       = false;
    };
    certificates.add(cert);
    #ok(cert);
  };

  // ── Certificate Lookup ────────────────────────────────────────────────────

  /// Verify a certificate by its 9-char certId (public — no auth required).
  public query func verifyCertificate(certId : Text) : async ?AcademyTypes.Certificate {
    certificates.find(func(c : AcademyTypes.Certificate) : Bool { c.certId == certId });
  };

  /// Get a certificate by its shareToken (public verification URL).
  public query func getCertificateByShareToken(shareToken : Text) : async ?AcademyTypes.Certificate {
    certificates.find(func(c : AcademyTypes.Certificate) : Bool { c.shareToken == shareToken });
  };

  /// Search certificates by certId, fullName, or tier (public — no auth required).
  public query func searchCertificates(searchTerm : Text) : async [AcademyTypes.Certificate] {
    let lower = searchTerm.toLower();
    certificates.filter(func(c : AcademyTypes.Certificate) : Bool {
      c.certId.toLower().contains(#text lower) or
      c.certInfo.fullName.toLower().contains(#text lower) or
      c.tierName.toLower().contains(#text lower)
    }).toArray();
  };

  /// Get all certificates for the public Certificate Wall (no auth required).
  public query func listAllCertificates() : async [AcademyTypes.Certificate] {
    certificates.toArray();
  };

  /// Get certificates filtered by tier (public — no auth required).
  public query func getCertificatesByTier(tierId : Text) : async [AcademyTypes.Certificate] {
    certificates.filter(func(c : AcademyTypes.Certificate) : Bool { c.tierId == tierId }).toArray();
  };

  /// Get featured certificates (admin-pinned on Certificate Wall).
  public query func getFeaturedCertificates() : async [AcademyTypes.Certificate] {
    certificates.filter(func(c : AcademyTypes.Certificate) : Bool { c.featured and c.isValid }).toArray();
  };

  // ── Admin Functions ───────────────────────────────────────────────────────

  /// Admin: revoke (isValid = false) or reinstate (isValid = true) a certificate.
  public func adminRevokeOrReinstateCertificate(certId : Text, isValid : Bool) : async Common.Result<(), Text> {
    switch (certificates.findIndex(func(c : AcademyTypes.Certificate) : Bool { c.certId == certId })) {
      case null { #err("Certificate not found: " # certId) };
      case (?idx) {
        let existing = certificates.at(idx);
        certificates.put(idx, { existing with isValid });
        #ok(());
      };
    };
  };

  /// Admin: feature or un-feature a certificate on the Certificate Wall.
  public func adminFeatureCertificate(certId : Text, featured : Bool) : async Common.Result<(), Text> {
    switch (certificates.findIndex(func(c : AcademyTypes.Certificate) : Bool { c.certId == certId })) {
      case null { #err("Certificate not found: " # certId) };
      case (?idx) {
        let existing = certificates.at(idx);
        certificates.put(idx, { existing with featured });
        #ok(());
      };
    };
  };

  /// Admin: manually issue a certificate for a given tier (special cases).
  public func adminManualIssueCertificate(
    tierId : Text,
    info   : AcademyTypes.CertificateInfo,
  ) : async Common.Result<AcademyTypes.Certificate, Text> {
    if (not AcademyLib.isValidTier(tierId)) {
      return #err("Invalid tier ID.");
    };
    certIdCounter.value := certIdCounter.value + 1;
    let certId     = AcademyLib.generateCertId(certIdCounter.value, info.fullName, tierId);
    let shareToken = AcademyLib.generateShareToken(certIdCounter.value, certId);
    let cert : AcademyTypes.Certificate = {
      certId;
      shareToken;
      tierId;
      tierName       = AcademyLib.tierName(tierId);
      certInfo       = info;
      score          = 30;
      totalQuestions = 30;
      issuedAt       = Time.now();
      isValid        = true;
      featured       = false;
    };
    certificates.add(cert);
    #ok(cert);
  };

  /// Admin: export all certificates as structured data (for CSV download).
  public query func adminExportCertificates() : async [AcademyTypes.Certificate] {
    certificates.toArray();
  };

  /// Get quiz attempt statistics per tier.
  public query func getQuizAttemptStats() : async [AcademyTypes.QuizAttemptStats] {
    attemptStats.toArray();
  };

  /// Admin: get quiz attempt logs (fingerprint + IP hash) per tier.
  public query func adminGetAttemptLogs(tierId : Text) : async [AcademyTypes.QuizAttemptLog] {
    attemptLogs.filter(func(l : AcademyTypes.QuizAttemptLog) : Bool { l.tierId == tierId }).toArray();
  };

  /// Admin: get per-question fail rate stats for a tier.
  public query func adminGetQuestionFailStats(tierId : Text) : async [AcademyTypes.QuestionFailStat] {
    questionFailStats.filter(func(s : AcademyTypes.QuestionFailStat) : Bool { s.tierId == tierId }).toArray();
  };

  /// Admin: flag or unflag a quiz question for review.
  public func adminFlagQuestion(questionId : Text, flagged : Bool) : async () {
    AcademyLib.flagQuestion(flaggedQuestions, questionId, flagged);
  };

  /// Get all flagged question IDs (admin).
  public query func adminGetFlaggedQuestions() : async [Text] {
    flaggedQuestions.toArray();
  };

  /// Admin: set or clear tier disabled (maintenance mode per tier).
  public func adminSetTierDisabled(tierId : Text, disabled : Bool) : async Common.Result<(), Text> {
    if (not AcademyLib.isValidTier(tierId)) {
      return #err("Invalid tier ID.");
    };
    AcademyLib.setTierDisabled(disabledTiers, tierId, disabled);
    #ok(());
  };

  /// Get all tier disabled states (public — frontend shows maintenance mode banner).
  public query func getTierDisabledStates() : async [AcademyTypes.TierDisabledEntry] {
    disabledTiers.toArray();
  };

  /// Get the current announcement banner (if any).
  public query func getAnnouncementBanner() : async ?AcademyTypes.AnnouncementBanner {
    announcementBanner.banner;
  };

  /// Admin: set or update the announcement banner.
  public func adminSetAnnouncementBanner(text : Text, isPinned : Bool) : async () {
    announcementBanner.banner := ?{
      text;
      isPinned;
      updatedAt = Time.now();
    };
  };

  /// Admin: get certificate stats (total + breakdown by tier).
  public query func adminGetStats() : async AcademyTypes.AdminStats {
    let tiers = ["beginner", "intermediate", "advanced", "expert", "master"];
    let certsByTier : [(Text, Nat)] = tiers.map<Text, (Text, Nat)>(func(t) {
      let count = certificates.filter(func(c : AcademyTypes.Certificate) : Bool { c.tierId == t }).size();
      (t, count);
    });
    {
      totalCertificates = certificates.size();
      certsByTier;
    };
  };

  // ── Lesson Ratings ────────────────────────────────────────────────────────

  /// Submit a star rating (1–5) for a lesson.
  public func submitLessonRating(tierId : Text, lessonId : Text, rating : Nat) : async Bool {
    if (rating < 1 or rating > 5) { return false };
    lessonRatings.add({
      lessonId;
      tierId;
      rating;
      timestamp = Time.now();
    });
    true;
  };

  /// Get all ratings for a specific lesson.
  public query func getLessonRatings(tierId : Text, lessonId : Text) : async [AcademyTypes.LessonRating] {
    lessonRatings.filter(func(r : AcademyTypes.LessonRating) : Bool {
      r.tierId == tierId and r.lessonId == lessonId
    }).toArray();
  };

  /// Admin: get average rating per lesson as (tierId, lessonId, avgRating).
  public query func getAdminLessonRatings() : async [(Text, Text, Float)] {
    // Collect all distinct (tierId, lessonId) pairs
    var result : [(Text, Text, Float)] = [];
    let all = lessonRatings.toArray();
    // Build unique pairs
    let seen = List.empty<(Text, Text)>();
    for (r in all.values()) {
      let already = seen.find(func(p : (Text, Text)) : Bool { p.0 == r.tierId and p.1 == r.lessonId });
      switch (already) {
        case null { seen.add((r.tierId, r.lessonId)) };
        case _ {};
      };
    };
    // For each unique pair compute average
    for (pair in seen.toArray().values()) {
      let matching = all.filter(func(r : AcademyTypes.LessonRating) : Bool {
        r.tierId == pair.0 and r.lessonId == pair.1
      });
      let total = matching.foldLeft(0, func(acc : Nat, r : AcademyTypes.LessonRating) : Nat { acc + r.rating });
      let count = matching.size();
      let avg : Float = if (count == 0) 0.0 else total.toFloat() / count.toFloat();
      result := result.concat([(pair.0, pair.1, avg)]);
    };
    result;
  };

  // ── Daily Active Learners Tracking ────────────────────────────────────────

  /// Log a daily active learner for the given date string (e.g. "2026-05-02").
  public func logDailyActive(date : Text) : async () {
    switch (dailyActiveLogs.findIndex(func(l : AcademyTypes.DailyActiveLog) : Bool { l.date == date })) {
      case (?idx) {
        let existing = dailyActiveLogs.at(idx);
        dailyActiveLogs.put(idx, { existing with count = existing.count + 1 });
      };
      case null {
        dailyActiveLogs.add({ date; count = 1 });
      };
    };
  };

  /// Get daily active learner counts (admin analytics).
  public query func getDailyActiveCounts() : async [AcademyTypes.DailyActiveLog] {
    dailyActiveLogs.toArray();
  };

  // ── Lesson Completion Trend Logging ───────────────────────────────────────

  /// Log a lesson completion event (for admin trend analytics).
  public func logLessonCompletion(tierId : Text, lessonId : Text, timestamp : Int) : async () {
    lessonCompletionLogs.add({ lessonId; tierId; completedAt = timestamp });
  };

  /// Get lesson completion logs (admin trend analytics).
  public query func getLessonCompletionTrends() : async [AcademyTypes.LessonCompletionLog] {
    lessonCompletionLogs.toArray();
  };

  // ── Checkpoint Quiz (Mid-tier, no certificate) ────────────────────────────

  /// Submit a mid-tier checkpoint quiz score (practice only — no certificate issued).
  public func submitCheckpointQuiz(tierId : Text, score : Nat) : async Bool {
    if (not AcademyLib.isValidTier(tierId)) { return false };
    // Simply acknowledge — no certificate, just progress tracking on frontend
    true;
  };

  // ── Admin: Quiz Fail Messages ─────────────────────────────────────────────

  /// Admin: set a custom encouragement message shown to users who fail a tier quiz.
  public func setQuizFailMessage(tierId : Text, message : Text, passcode : Text) : async Bool {
    let ADMIN_PASSCODE = "2420075112009BILAWALPRAKRITI";
    if (passcode != ADMIN_PASSCODE) { return false };
    switch (tierFailMessages.findIndex(func(m : AcademyTypes.TierFailMessage) : Bool { m.tierId == tierId })) {
      case (?idx) {
        tierFailMessages.put(idx, { tierId; message });
      };
      case null {
        tierFailMessages.add({ tierId; message });
      };
    };
    true;
  };

  /// Get the custom fail message for a tier (or null if not set).
  public query func getQuizFailMessage(tierId : Text) : async ?Text {
    switch (tierFailMessages.find(func(m : AcademyTypes.TierFailMessage) : Bool { m.tierId == tierId })) {
      case (?m) ?m.message;
      case null null;
    };
  };

  // ── Admin: Featured Lesson ────────────────────────────────────────────────

  /// Admin: set the featured lesson for a tier.
  public func setFeaturedLesson(tierId : Text, lessonId : Text, passcode : Text) : async Bool {
    let ADMIN_PASSCODE = "2420075112009BILAWALPRAKRITI";
    if (passcode != ADMIN_PASSCODE) { return false };
    switch (tierFeaturedLessons.findIndex(func(f : AcademyTypes.TierFeaturedLesson) : Bool { f.tierId == tierId })) {
      case (?idx) {
        tierFeaturedLessons.put(idx, { tierId; lessonId });
      };
      case null {
        tierFeaturedLessons.add({ tierId; lessonId });
      };
    };
    true;
  };

  /// Get the featured lesson ID for a tier (null if none set).
  public query func getFeaturedLesson(tierId : Text) : async ?Text {
    switch (tierFeaturedLessons.find(func(f : AcademyTypes.TierFeaturedLesson) : Bool { f.tierId == tierId })) {
      case (?f) ?f.lessonId;
      case null null;
    };
  };
};
