import List "mo:core/List";
import RoadmapTypes "types/roadmap";
import AcademyTypes "types/academy";
import RoadmapLib "lib/roadmap";
import AcademyApi "mixins/academy-api";
import RoadmapApi "mixins/roadmap-api";
import ZenoAiApi "mixins/zeno-ai-api";
import LearningScienceApi "mixins/learning-science-api";

actor {
  // ── Academy state ──────────────────────────────────────────────────────────────────────────
  // All certificates are globally stored — accessible from any device or session.
  let certificates         = List.empty<AcademyTypes.Certificate>();
  let certIdCounter        = { var value : Nat = 0 };
  let attemptStats         = List.empty<AcademyTypes.QuizAttemptStats>();
  let announcementBanner   = { var banner : ?AcademyTypes.AnnouncementBanner = null };
  // Per-question fail stats for admin analytics
  let questionFailStats    = List.empty<AcademyTypes.QuestionFailStat>();
  // Attempt logs: IP + browser fingerprint per quiz attempt (anti-cheat)
  let attemptLogs          = List.empty<AcademyTypes.QuizAttemptLog>();
  // Per-tier disabled flags (admin maintenance mode per tier)
  let disabledTiers        = List.empty<AcademyTypes.TierDisabledEntry>();
  // Flagged question IDs (admin review queue)
  let flaggedQuestions     = List.empty<Text>();
  // Lesson ratings (1–5 stars per lesson)
  let lessonRatings        = List.empty<AcademyTypes.LessonRating>();
  // Daily active learner log (admin analytics)
  let dailyActiveLogs      = List.empty<AcademyTypes.DailyActiveLog>();
  // Lesson completion logs (admin trend analytics)
  let lessonCompletionLogs = List.empty<AcademyTypes.LessonCompletionLog>();
  // Per-tier custom quiz fail messages (admin-set)
  let tierFailMessages     = List.empty<AcademyTypes.TierFailMessage>();
  // Per-tier featured lesson (admin-set)
  let tierFeaturedLessons  = List.empty<AcademyTypes.TierFeaturedLesson>();

  // ── Learning-science state ────────────────────────────────────────────────────────────
  let masteryRecords        = List.empty<AcademyTypes.MasteryRecord>();
  let monthlyEvents         = List.empty<AcademyTypes.MonthlyLessonEvent>();
  let shareSnapshotCounter  = { var value : Nat = 0 };
  let progressSnapshots     = List.empty<AcademyTypes.ProgressSnapshot>();
  let lessonOfWeekHolder    = { var item : ?AcademyTypes.LessonOfWeek = null };
  let abTests               = List.empty<AcademyTypes.ABTestRecord>();
  let engagements           = List.empty<AcademyTypes.LessonEngagement>();

  // ── Roadmap state ─────────────────────────────────────────────────────────────────────
  // Seeded with confirmed milestones: 2026, April 2 2027, Jan 1 2028.
  let roadmapMilestones = List.fromArray<RoadmapTypes.RoadmapMilestone>(RoadmapLib.defaultMilestones());

  // ── Mixins ────────────────────────────────────────────────────────────────────────────
  include AcademyApi(
    certificates, certIdCounter, attemptStats, announcementBanner,
    questionFailStats, attemptLogs, disabledTiers, flaggedQuestions,
    lessonRatings, dailyActiveLogs, lessonCompletionLogs,
    tierFailMessages, tierFeaturedLessons,
  );
  include RoadmapApi(roadmapMilestones);
  include ZenoAiApi();
  include LearningScienceApi(
    masteryRecords, monthlyEvents, shareSnapshotCounter,
    progressSnapshots, lessonOfWeekHolder, abTests, engagements,
  );
};
