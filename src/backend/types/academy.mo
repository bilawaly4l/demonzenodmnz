module {
  /// Supported trading tier IDs
  public type TierId = Text; // "beginner" | "intermediate" | "advanced" | "expert" | "master"

  /// A single MCQ option
  public type QuizOption = {
    id   : Text; // "a" | "b" | "c" | "d"
    text : Text;
  };

  /// A single multiple-choice question inside a tier quiz
  /// isReviewFlagged: admin has flagged this question for review
  public type QuizQuestion = {
    id               : Text;
    question         : Text;
    options          : [QuizOption];
    correctOption    : Text;  // "a" | "b" | "c" | "d"
    explanation      : Text;  // shown after answering
    isReviewFlagged  : Bool;  // admin can flag for review
  };

  /// The full quiz for one tier (30 questions drawn from 100+ question pool)
  public type TierQuiz = {
    tierId    : TierId;
    tierName  : Text;
    questions : [QuizQuestion]; // 30 randomly selected, answer options shuffled
  };

  /// A user's answer to a single question
  public type QuizAnswer = {
    questionId     : Text;
    selectedOption : Text;
  };

  /// Per-question breakdown item
  public type QuizBreakdownItem = {
    questionId : Text;
    correct    : Bool;
  };

  /// The result of a quiz attempt
  public type QuizResult = {
    tierId    : TierId;
    tierName  : Text;
    score     : Nat;  // number correct out of 30
    passed    : Bool; // score == 30 (perfect score required)
    breakdown : [QuizBreakdownItem];
  };

  /// Full personal info required to issue a certificate
  public type CertificateInfo = {
    fullName    : Text;
    fathersName : Text;
    country     : Text;
    dateOfBirth : Text;
    email       : Text;
    city        : Text;
  };

  /// Certificate record stored globally in canister.
  /// certId: 9-char uppercase alphanumeric unique certificate ID (A-Z, 0-9)
  /// shareToken: separate unique token for public verification URL (different from certId)
  /// isValid: false = revoked by admin
  /// featured: true = admin-pinned on Certificate Wall
  public type Certificate = {
    certId         : Text;  // 9-char uppercase alphanumeric
    shareToken     : Text;  // unique token for public verification link
    tierId         : TierId;
    tierName       : Text;
    certInfo       : CertificateInfo;
    score          : Nat;   // always 30
    totalQuestions : Nat;   // always 30
    issuedAt       : Int;   // timestamp in nanoseconds
    isValid        : Bool;  // true = active, false = revoked
    featured       : Bool;  // admin-pinned on Certificate Wall
  };

  /// Admin stats response
  public type AdminStats = {
    totalCertificates : Nat;
    certsByTier       : [(Text, Nat)];
  };

  /// Per-question failure rate tracking (stored in backend, visible to admin)
  public type QuestionFailStat = {
    questionId  : Text;
    tierId      : Text;
    totalSeen   : Nat; // how many quiz attempts included this question
    failCount   : Nat; // how many times this question was answered wrong
  };

  /// A single quiz attempt log record (IP + fingerprint per attempt)
  public type QuizAttemptLog = {
    tierId      : Text;
    fingerprint : Text; // browser fingerprint or IP hash
    timestamp   : Int;
    passed      : Bool;
    score       : Nat;
  };

  /// Quiz attempt statistics per tier
  public type QuizAttemptStats = {
    tierId        : Text;
    totalAttempts : Nat;
    passCount     : Nat;
  };

  /// Tier disabled state (for admin maintenance mode per tier)
  public type TierDisabledEntry = {
    tierId   : Text;
    disabled : Bool;
  };

  /// Announcement banner for the Academy page
  public type AnnouncementBanner = {
    text      : Text;
    isPinned  : Bool;
    updatedAt : Int;
  };

  // ── New enhancement types ────────────────────────────────────────────

  /// A user's star rating for a single lesson
  public type LessonRating = {
    lessonId  : Text;
    tierId    : Text;
    rating    : Nat;   // 1-5 stars
    timestamp : Int;
  };

  /// A personal note saved for a lesson (stored per-session in backend)
  public type LessonNote = {
    lessonId  : Text;
    note      : Text;
    timestamp : Int;
  };

  /// User-set weekly study goal
  public type WeeklyGoal = {
    targetLessons : Nat;
    weekStart     : Int; // timestamp of Monday 00:00 UTC
  };

  /// Daily active learner log entry (for admin analytics)
  public type DailyActiveLog = {
    date  : Text; // ISO date string e.g. "2026-05-02"
    count : Nat;
  };

  /// A single lesson completion log entry (for admin trend analytics)
  public type LessonCompletionLog = {
    lessonId    : Text;
    tierId      : Text;
    completedAt : Int;
  };

  /// Certificate frame style selected before download
  public type CertificateFrame = { #classic; #dark; #gold };

  /// Quiz mode variant
  public type QuizMode = { #standard; #practice; #challenge };

  /// Result of a mid-tier checkpoint quiz (no certificate awarded)
  public type CheckpointQuizResult = {
    tierId    : Text;
    score     : Nat;
    timestamp : Int;
  };

  /// Post-lesson confidence entry
  public type LessonConfidenceEntry = {
    lessonId  : Text;
    tierId    : Text;
    rating    : Nat;   // 1-5
    timestamp : Int;
  };

  /// Admin-stored custom fail message per tier
  public type TierFailMessage = {
    tierId  : Text;
    message : Text;
  };

  /// Admin-stored featured lesson per tier
  public type TierFeaturedLesson = {
    tierId    : Text;
    lessonId  : Text;
  };

  // ── Learning-science domain types ─────────────────────────────────────────

  /// Composite mastery score for a single lesson
  /// masteryPct = (confidenceScore × 0.3) + (conceptCheckerScore × 0.35) + (quizScore × 0.35)
  public type MasteryRecord = {
    lessonId            : Text;
    tier                : Text;
    confidenceScore     : Float;
    conceptCheckerScore : Float;
    quizScore           : Float;
    masteryPct          : Float;
    updatedAt           : Int;
  };

  /// Monthly challenge progress (10 lessons/month earns the badge)
  public type MonthlyChallenge = {
    month            : Text;  // "YYYY-MM"
    lessonsCompleted : Nat;
    badgeEarned      : Bool;
    targetLessons    : Nat;   // always 10
  };

  /// A completed-lesson event stored per monthly bucket
  public type MonthlyLessonEvent = {
    month    : Text;
    lessonId : Text;
  };

  /// Read-only progress snapshot for study-partner share links
  public type ProgressSnapshot = {
    shareToken         : Text;
    tiersCompleted     : [Text];
    certificatesEarned : [Text];
    masteryLevels      : [(Text, Float)];
    createdAt          : Int;
  };

  /// Admin-set "lesson of the week" with 7-day expiry
  public type LessonOfWeek = {
    lessonId    : Text;
    lessonTitle : Text;
    tier        : Text;
    setAt       : Int;
    expiresAt   : Int;  // setAt + 7 days in nanoseconds
  };

  /// A/B test record for a quiz question
  public type ABTestRecord = {
    questionId       : Text;
    versionAText     : Text;
    versionBText     : Text;
    versionAPassCount : Nat;
    versionBPassCount : Nat;
    versionAAttempts : Nat;
    versionBAttempts : Nat;
    activeVersion    : Text;  // "A" | "B"
  };

  /// Engagement tracking per lesson (for admin heatmap)
  public type LessonEngagement = {
    lessonId         : Text;
    tier             : Text;
    totalTimeSeconds : Nat;
    visitCount       : Nat;
  };
};
