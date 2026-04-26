import type {
  AbTest,
  ActivityEntry,
  Analytics,
  Announcement,
  AssetSentiment,
  AssetStats,
  AuditEntry,
  AuditSnapshot,
  BinancePost,
  BurnScheduleEntry,
  BurnTracker,
  CommunityCounter,
  CommunityMilestone,
  Confidence,
  DayStats,
  DemonZenoQuote,
  Direction,
  FAQ,
  HolderBenefit,
  JournalEntry,
  MaintenanceMode,
  MarketMoodBanner,
  MarketSentiment,
  MarketType,
  NotifyMe,
  PriceData,
  PushNotification,
  ResponseRating,
  Result,
  ResultStatus,
  Result_1,
  Result_2,
  Result_3,
  Result_4,
  Result_5,
  Result_6,
  Result_7,
  Result_8,
  Result_9,
  Result_10,
  Result_11,
  Result_12,
  Result_13,
  Result_14,
  Result_15,
  Result_16,
  Result_17,
  Result_18,
  Result_19,
  RoadmapMilestone,
  SentimentLevel,
  Signal,
  SignalOfWeekFull,
  SignalPerformanceStats,
  Stats,
  StatsConfig,
  Testimonial,
  Timeframe,
  WhitepaperContent,
  WhitepaperSection,
} from "./backend";

export type {
  AbTest,
  ActivityEntry,
  Analytics,
  Announcement,
  AssetSentiment,
  AssetStats,
  AuditEntry,
  AuditSnapshot,
  BinancePost,
  BurnScheduleEntry,
  BurnTracker,
  CommunityCounter,
  CommunityMilestone,
  Confidence,
  DayStats,
  DemonZenoQuote,
  Direction,
  FAQ,
  HolderBenefit,
  JournalEntry,
  MaintenanceMode,
  MarketMoodBanner,
  MarketSentiment,
  MarketType,
  NotifyMe,
  PriceData,
  PushNotification,
  ResponseRating,
  Result,
  Result_1,
  Result_2,
  Result_3,
  Result_4,
  Result_5,
  Result_6,
  Result_7,
  Result_8,
  Result_9,
  Result_10,
  Result_11,
  Result_12,
  Result_13,
  Result_14,
  Result_15,
  Result_16,
  Result_17,
  Result_18,
  Result_19,
  ResultStatus,
  RoadmapMilestone,
  SentimentLevel,
  Signal,
  SignalOfWeekFull,
  SignalPerformanceStats,
  Stats,
  StatsConfig,
  Testimonial,
  Timeframe,
  WhitepaperContent,
  WhitepaperSection,
};

export type MarketFilter = "All" | "Crypto" | "Forex" | "Stocks";
export type ExtendedResultStatus = "Win" | "Loss" | "Active" | "Expired";

export interface SessionContextValue {
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  clearSession: () => void;
}

// ─── AI Types ──────────────────────────────────────────────────────────────
export type AiMode = "normal" | "insane";
export type AiLanguage = "en" | "ar" | "es" | "zh";

export interface AiSessionState {
  token: string;
  mode: AiMode;
  isAdmin: boolean;
}

export interface AiSignal {
  id: string;
  timestamp: number;
  asset: string;
  entry: string;
  tp1: string;
  tp2: string;
  tp3: string;
  sl: string;
  timeframe: string;
  confidence: string;
  provider: string;
  result: "pending" | "win" | "loss";
}

export interface SignalAccuracyStats {
  total: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
}

// ─── Daily Briefing ────────────────────────────────────────────────────────
export interface DailyBriefing {
  content: string;
  generatedAt: number;
}

// ─── Rating Entry ─────────────────────────────────────────────────────────
export interface RatingEntry {
  messageId: string;
  rating: 1 | -1;
  timestamp: bigint;
}

// ─── SignalOfTheDay ────────────────────────────────────────────────────────
export type SignalOfTheDay = Signal;

// ─── Signal archive filter state ──────────────────────────────────────────
export interface SignalArchiveFilter {
  result: "all" | "win" | "loss" | "active" | "expired";
  confidence: "all" | "Low" | "Medium" | "High";
  market: "all" | "Crypto" | "Forex" | "Stock";
  search: string;
  dateRange: "all" | "7d" | "30d" | "90d";
}

// ─── Scheduled Signal ─────────────────────────────────────────────────────
export interface ScheduledSignal extends Signal {
  scheduledAt: bigint;
  published: boolean;
}
