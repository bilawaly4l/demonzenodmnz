import type {
  AdminStats,
  AnnouncementBanner,
  Certificate,
  CertificateInfo,
  QuizAttemptStats,
  QuizOption,
  QuizQuestion,
  RoadmapMilestone,
  TierQuiz,
  TokenInfo,
  ZenoAiResponse,
} from "./backend";

export type {
  AdminStats,
  AnnouncementBanner,
  Certificate,
  CertificateInfo,
  QuizAttemptStats,
  QuizOption,
  QuizQuestion,
  RoadmapMilestone,
  TierQuiz,
  TokenInfo,
  ZenoAiResponse,
};

// ─── Tier / Lesson ─────────────────────────────────────────────────────────────

export type CertificateTier =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert"
  | "master";

export type CertificateFrame = "classic" | "dark" | "gold";

export type LessonDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert"
  | "master";

export interface TierInfo {
  id: CertificateTier;
  name: string;
  description: string;
  color: string;
  icon: string;
  lessonsCount: number;
}

export interface ConceptQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface ChartPatternData {
  name: string;
  description: string;
  signal: "bullish" | "bearish" | "continuation";
}

export interface TraderProfile {
  name: string;
  era: string;
  story: string;
  keyLesson: string;
  quote: string;
}

export interface MythVsReality {
  myth: string;
  reality: string;
}

export interface SpotTheMistake {
  scenario: string;
  question: string;
  mistakes: string[];
  explanation: string;
}

export interface LessonData {
  id: string;
  title: string;
  duration: string;
  difficulty: LessonDifficulty;
  content: string;
  whyMatters: string;
  realTradeBreakdown: string;
  caseStudy?: string;
  traderProfile?: TraderProfile;
  mythVsReality?: MythVsReality[];
  keyTakeaways: string[];
  commonMistakes: string[];
  demonZenoQuote: string;
  chartPatterns?: ChartPatternData[];
  conceptCheckerQuestions?: ConceptQuestion[];
  spotTheMistake?: SpotTheMistake;
}

// ─── Quiz types ────────────────────────────────────────────────────────────────

export type QuizMode = "standard" | "practice" | "challenge";

export interface ShuffledQuizQuestion {
  id: string;
  text: string;
  shuffledOptions: string[]; // display order (randomized)
  correctShuffledIndex: number; // correct answer position after shuffle
  difficulty: "standard" | "hard";
}

export interface QuizState {
  mode: QuizMode;
  currentIndex: number;
  questions: ShuffledQuizQuestion[];
  answers: (number | null)[]; // user answer indices in shuffled order
  score: number;
  timeLeft: number;
  isFinished: boolean;
  passed: boolean;
  tierId: string;
  seed: bigint;
}

// ─── Personal Info for Certificate ───────────────────────────────────────────

export interface PersonalInfo {
  fullName: string;
  fathersName: string;
  country: string;
  dateOfBirth: string;
  email: string;
  city: string;
}

// ─── Admin Session ────────────────────────────────────────────────────────────

export interface AdminSessionContextValue {
  isAdminUnlocked: boolean;
  adminClickCount: number;
  showPasscodeModal: boolean;
  onHeroImageClick: () => void;
  submitPasscode: (passcode: string) => boolean;
  dismissModal: () => void;
  lockAdmin: () => void;
}

// ─── Theme ─────────────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

// ─── Lesson Progress ─────────────────────────────────────────────────────────

export interface LessonProgressContextValue {
  getLessonProgress: (tierId: string) => string[];
  markLessonComplete: (tierId: string, lessonId: string) => void;
  getLessonBookmarks: () => Record<string, boolean>;
  toggleBookmark: (tierId: string, lessonId: string) => void;
  getLastLesson: (tierId: string) => string | null;
  setLastLesson: (tierId: string, lessonId: string) => void;
  getConfidenceRating: (tierId: string, lessonId: string) => number;
  setConfidenceRating: (
    tierId: string,
    lessonId: string,
    rating: number,
  ) => void;
  getStreakDays: () => number;
  updateStreak: () => void;
  getSpacedRepetitionReminder: (
    tierId: string,
    lessonId: string,
  ) => number | null;
  setSpacedRepetitionReminder: (tierId: string, lessonId: string) => void;
  // Personal notes
  getLessonNote: (tierId: string, lessonId: string) => string;
  setLessonNote: (tierId: string, lessonId: string, note: string) => void;
  // Star ratings (lesson quality rating by user)
  getLessonStarRating: (tierId: string, lessonId: string) => number;
  setLessonStarRating: (
    tierId: string,
    lessonId: string,
    rating: number,
  ) => void;
  // Lessons learned log
  getLessonsLearnedLog: () => LessonsLearnedEntry[];
  addToLessonsLearnedLog: (entry: Omit<LessonsLearnedEntry, "id">) => void;
  // Weekly goal
  getWeeklyGoal: () => WeeklyGoal;
  setWeeklyGoalTarget: (target: number) => void;
  incrementWeeklyProgress: () => void;
  // Comeback reminder
  getComebackReminder: () => boolean;
  dismissComebackReminder: () => void;
}

export interface LessonsLearnedEntry {
  id: string;
  date: string;
  lessonTitle: string;
  note: string;
  tierId: string;
}

export interface WeeklyGoal {
  target: number; // lessons/week
  weekStart: string; // ISO date string of week start
  completed: number;
}

// ─── Sound Effects ────────────────────────────────────────────────────────────

export interface SoundContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  playComplete: () => void;
  playCorrect: () => void;
  playWrong: () => void;
}

// ─── Zeno AI Chat ─────────────────────────────────────────────────────────────

export interface ZenoAiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
