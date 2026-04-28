import type {
  AbTest,
  ActivityEntry,
  Announcement,
  BinancePost,
  BurnEvent,
  BurnScheduleEntry,
  BurnTracker,
  ChatMessage,
  CommunityCounter,
  CommunityMilestone,
  CommunityQuestion,
  DemonZenoQuote,
  FAQ,
  HolderBenefit,
  HypeMilestone,
  JournalEntry,
  MaintenanceMode,
  MarketMoodBanner,
  MarketSentiment,
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
  Result_21,
  Result_22,
  RoadmapMilestone,
  Signal,
  SignalInput,
  SignalOfWeekFull,
  SignalPerformanceStats,
  SignalTemplate,
  Stats,
  StatsConfig,
  Testimonial,
  TokenData,
  TopTrader,
  WhitepaperContent,
  backendInterface,
} from "../backend";
import {
  AnnouncementCategory,
  Confidence,
  Direction,
  FaqCategory,
  MarketType,
  ResultStatus,
  SentimentLevel,
  Timeframe,
} from "../backend";

const sampleSignals: Signal[] = [
  {
    id: "1",
    asset: "BTC/USDT",
    marketType: MarketType.Crypto,
    direction: Direction.Buy,
    entryPrice: "62500",
    targetPrice: "68000",
    stopLoss: "59000",
    tp1: "65000",
    tp2: "67000",
    tp3: "68000",
    voteUp: BigInt(12),
    voteDown: BigInt(2),
    providerLabel: "DemonZeno AI",
    tags: ["crypto", "btc"],
    datePosted: "2026-04-20",
    result: ResultStatus.Win,
    notes: "Strong support at this level with bullish momentum",
    confidence: Confidence.High,
    timeframe: Timeframe.Swing,
    sourceLabel: "Technical Analysis",
    isDraft: false,
  },
  {
    id: "2",
    asset: "ETH/USDT",
    marketType: MarketType.Crypto,
    direction: Direction.Buy,
    entryPrice: "3100",
    targetPrice: "3600",
    stopLoss: "2900",
    tp1: "3300",
    tp2: "3450",
    tp3: "3600",
    voteUp: BigInt(8),
    voteDown: BigInt(1),
    providerLabel: "DemonZeno AI",
    tags: ["crypto", "eth"],
    datePosted: "2026-04-21",
    result: ResultStatus.Active,
    notes: "Break of key resistance zone",
    confidence: Confidence.Medium,
    timeframe: Timeframe.Scalp,
    sourceLabel: "Technical Analysis",
    isDraft: false,
  },
  {
    id: "3",
    asset: "EUR/USD",
    marketType: MarketType.Forex,
    direction: Direction.Sell,
    entryPrice: "1.0850",
    targetPrice: "1.0700",
    stopLoss: "1.0950",
    tp1: "1.0800",
    tp2: "1.0750",
    tp3: "1.0700",
    voteUp: BigInt(5),
    voteDown: BigInt(3),
    providerLabel: "DemonZeno AI",
    tags: ["forex", "eurusd"],
    datePosted: "2026-04-21",
    result: ResultStatus.Active,
    notes: "Dollar strength play",
    confidence: Confidence.Medium,
    timeframe: Timeframe.Swing,
    sourceLabel: "On-chain Data",
    isDraft: false,
  },
  {
    id: "4",
    asset: "AAPL",
    marketType: MarketType.Stock,
    direction: Direction.Buy,
    entryPrice: "178",
    targetPrice: "195",
    stopLoss: "170",
    tp1: "185",
    tp2: "190",
    tp3: "195",
    voteUp: BigInt(3),
    voteDown: BigInt(4),
    providerLabel: "DemonZeno AI",
    tags: ["stocks", "aapl"],
    datePosted: "2026-04-19",
    result: ResultStatus.Loss,
    notes: "Earnings play",
    confidence: Confidence.Low,
    timeframe: Timeframe.LongTerm,
    sourceLabel: "Technical Analysis",
    isDraft: false,
  },
];

const sampleFaqs: FAQ[] = [
  {
    id: "1",
    question: "What is DemonZeno?",
    answer:
      "DemonZeno is an anime-inspired free trading signals platform and meme token project providing daily signals for crypto, forex, and stocks.",
    order: BigInt(1),
    category: FaqCategory.Platform,
    helpfulCount: BigInt(24),
    notHelpfulCount: BigInt(1),
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "2",
    question: "What is DMNZ?",
    answer:
      "DMNZ is the DemonZeno token — a meme token launching April 2, 2028 via a Telegram Mini App on Blum as a 100% fair launch.",
    order: BigInt(2),
    category: FaqCategory.DmnzToken,
    helpfulCount: BigInt(18),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "3",
    question: "Are the signals really free?",
    answer:
      "Yes, 100% free. No subscription, no fees, no hidden charges — ever.",
    order: BigInt(3),
    category: FaqCategory.Signals,
    helpfulCount: BigInt(32),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "4",
    question: "How accurate are the signals?",
    answer:
      "DemonZeno provides high-quality signals based on technical analysis. Past performance is not a guarantee of future results.",
    order: BigInt(4),
    category: FaqCategory.Signals,
    helpfulCount: BigInt(15),
    notHelpfulCount: BigInt(2),
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "5",
    question: "What markets does DemonZeno cover?",
    answer:
      "Crypto tokens (BTC, ETH, SOL and more), Forex pairs (EUR/USD, GBP/JPY and more), and Stock market (AAPL, TSLA, NVDA and more).",
    order: BigInt(5),
    category: FaqCategory.Signals,
    helpfulCount: BigInt(20),
    notHelpfulCount: BigInt(1),
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "6",
    question: "Where does DemonZeno post daily free signals?",
    answer:
      "DemonZeno posts daily free signals on Binance Square at @DemonZeno. Follow there to get every signal the moment it drops — no subscription needed.",
    order: BigInt(6),
    category: FaqCategory.Signals,
    helpfulCount: BigInt(28),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "7",
    question: "When does DMNZ token launch?",
    answer:
      "DMNZ launches on April 2, 2028 via a Telegram Mini App on the Blum platform. It's a 100% fair launch with no presale, no private sale, and no allocation breakdown.",
    order: BigInt(7),
    category: FaqCategory.DmnzToken,
    helpfulCount: BigInt(40),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(Date.now() * 1_000_000),
  },
];

const sampleStats: Stats = {
  wins: BigInt(87),
  losses: BigInt(13),
  active: BigInt(3),
  totalSignals: BigInt(100),
  winRate: 87.0,
  assetsCovered: BigInt(4),
};

const sampleAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "DMNZ Token Launch",
    body: "🚀 DMNZ Token launches April 2, 2028 on Blum! Follow @DemonZeno on Binance Square for daily free signals.",
    link: undefined,
    isActive: true,
    timestamp: BigInt(Date.now() * 1_000_000),
    category: AnnouncementCategory.Token,
    isPinned: false,
  },
];

const sampleMarketSentiment: MarketSentiment = {
  overall: SentimentLevel.Bullish,
  updatedAt: BigInt(Date.now() * 1_000_000),
  assets: [
    {
      asset: "BTC/USDT",
      market: "Crypto",
      level: SentimentLevel.Bullish,
      note: "Strong momentum above key support",
      trend: "up",
      price: 67200,
      priceChange24h: 2.4,
      lastPriceUpdate: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
    {
      asset: "ETH/USDT",
      market: "Crypto",
      level: SentimentLevel.Neutral,
      note: "Consolidating near resistance",
      trend: "flat",
      price: 3450,
      priceChange24h: 0.5,
      lastPriceUpdate: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
    {
      asset: "EUR/USD",
      market: "Forex",
      level: SentimentLevel.Bearish,
      note: "Dollar strength continues",
      trend: "down",
      price: 1.085,
      priceChange24h: -0.3,
      lastPriceUpdate: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
  ],
};

const sampleBinancePosts: BinancePost[] = [
  {
    id: "1",
    title: "BTC/USDT Breakout Confirmed — Entry Zone $67,200–$67,500",
    snippet:
      "Market structure looks strong after the consolidation phase. Watching for clean break above resistance with volume confirmation.",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-25",
  },
  {
    id: "2",
    title: "ETH/USDT Bullish divergence on the 4H — Signal incoming",
    snippet:
      "RSI divergence forming. On-chain data shows accumulation. Three TP targets marked, manage SL tight below $3,320.",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-25",
  },
  {
    id: "3",
    title: "SOL/USDT Ecosystem momentum building — watch $155 level",
    snippet:
      "Solana volume spiking with DEX activity. Could front-run broader altcoin rotation. Aggressive entry setup forming.",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-24",
  },
];

const sampleRoadmap: RoadmapMilestone[] = [
  {
    year: "2026",
    title: "Community Building",
    description:
      "Building DemonZeno community on Binance Square with daily free trading signals for crypto, forex, and stocks.",
    completed: false,
  },
  {
    year: "2027",
    title: "DMNZ Token Launch",
    description:
      "DMNZ meme token launches via BLUM mini app on Telegram as a 100% fair launch with no presale or insiders.",
    completed: false,
  },
  {
    year: "2028",
    title: "Buyback & Burn",
    description:
      "Massive Buyback & Burn event to reduce supply, increase token price, and trigger bonding curve for exchange listings.",
    completed: false,
  },
];

function mockSignal(
  overrides: Partial<Signal> &
    Pick<
      Signal,
      | "id"
      | "asset"
      | "marketType"
      | "direction"
      | "entryPrice"
      | "targetPrice"
      | "stopLoss"
      | "notes"
    >,
): Signal {
  return {
    datePosted: new Date().toISOString().split("T")[0],
    result: ResultStatus.Active,
    confidence: Confidence.Medium,
    timeframe: Timeframe.Swing,
    sourceLabel: "Technical Analysis",
    isDraft: false,
    tp1: "",
    tp2: "",
    tp3: "",
    voteUp: BigInt(0),
    voteDown: BigInt(0),
    providerLabel: "DemonZeno AI",
    tags: [],
    ...overrides,
  };
}

export const mockBackend: backendInterface = {
  getSignals: async () => sampleSignals,
  getFaqs: async () => sampleFaqs,
  getStats: async () => sampleStats,
  getAnnouncements: async () => sampleAnnouncements,
  getMarketSentiment: async () => sampleMarketSentiment,
  getBinanceFeed: async () => sampleBinancePosts,
  getRoadmap: async () => sampleRoadmap,

  getBurnTracker: async (): Promise<BurnTracker> => ({
    lastUpdated: BigInt(Date.now() * 1_000_000),
    totalBurned: BigInt(150_000_000),
  }),

  getCommunityCounter: async (): Promise<CommunityCounter> => ({
    lastUpdated: BigInt(Date.now() * 1_000_000),
    binanceCount: BigInt(125_400),
    twitterCount: BigInt(89_200),
  }),

  getMarketPrices: async (): Promise<PriceData[]> => [
    {
      asset: "BTC",
      price: 67200,
      priceChange24h: 2.4,
      trend: "up",
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
    {
      asset: "ETH",
      price: 3450,
      priceChange24h: 0.5,
      trend: "flat",
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
    {
      asset: "BNB",
      price: 580,
      priceChange24h: -1.2,
      trend: "down",
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
    {
      asset: "SOL",
      price: 152,
      priceChange24h: 3.8,
      trend: "up",
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
  ],

  refreshMarketPrices: async (): Promise<PriceData[]> => [],

  // Result_8 = { ok: StatsConfig } | { err: string }
  getStatsConfig: async (_token: string): Promise<Result_8> => ({
    __kind__: "ok",
    ok: { useManual: false } as StatsConfig,
  }),

  // Result_12 = { ok: Array<NotifyMe> } | { err: string }
  getNotifyMeList: async (_token: string): Promise<Result_12> => ({
    __kind__: "ok",
    ok: [] as NotifyMe[],
  }),

  validatePasscode: async (_passcode: string): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "mock-session-token-12345",
  }),

  validateSession: async (_token: string) => true,
  invalidateSession: async (_token: string) => undefined,

  // addSignal: 20 args — token, asset, marketType, direction, entryPrice, targetPrice, stopLoss, tp1, tp2, tp3, notes, confidence, sourceLabel, providerLabel, expiry, timeframe, isDraft, publishAt, templateId, tags
  addSignal: async (
    _token: string,
    asset: string,
    marketType: MarketType,
    direction: Direction,
    entryPrice: string,
    targetPrice: string,
    stopLoss: string,
    tp1: string,
    tp2: string,
    tp3: string,
    notes: string,
    confidence: Confidence,
    sourceLabel: string,
    providerLabel: string,
    _expiry: bigint | null,
    timeframe: Timeframe,
    _isDraft: boolean,
    _publishAt: bigint | null,
    _templateId: string | null,
    _tags: Array<string>,
  ): Promise<Result_2> => ({
    __kind__: "ok",
    ok: mockSignal({
      id: "new-1",
      asset,
      marketType,
      direction,
      entryPrice,
      targetPrice,
      stopLoss,
      tp1,
      tp2,
      tp3,
      notes,
      confidence,
      sourceLabel,
      providerLabel,
      timeframe,
    }),
  }),

  // updateSignal: 21 args
  updateSignal: async (
    _token: string,
    id: string,
    asset: string,
    marketType: MarketType,
    direction: Direction,
    entryPrice: string,
    targetPrice: string,
    stopLoss: string,
    tp1: string,
    tp2: string,
    tp3: string,
    notes: string,
    confidence: Confidence,
    sourceLabel: string,
    providerLabel: string,
    _expiry: bigint | null,
    timeframe: Timeframe,
    _isDraft: boolean,
    _publishAt: bigint | null,
    _templateId: string | null,
    _tags: Array<string>,
  ): Promise<Result_2> => ({
    __kind__: "ok",
    ok: mockSignal({
      id,
      asset,
      marketType,
      direction,
      entryPrice,
      targetPrice,
      stopLoss,
      tp1,
      tp2,
      tp3,
      notes,
      confidence,
      sourceLabel,
      providerLabel,
      timeframe,
    }),
  }),

  updateSignalResult: async (
    _token: string,
    id: string,
    result: ResultStatus,
  ): Promise<Result_2> => ({
    __kind__: "ok",
    ok: mockSignal({
      id,
      asset: "BTC/USDT",
      marketType: MarketType.Crypto,
      direction: Direction.Buy,
      entryPrice: "62500",
      targetPrice: "68000",
      stopLoss: "59000",
      notes: "",
      result,
    }),
  }),

  deleteSignal: async (_token: string, _id: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  // addFaq now takes 4 args: token, question, answer, category
  addFaq: async (
    _token: string,
    question: string,
    answer: string,
    _category: FaqCategory,
  ): Promise<Result_3> => ({
    __kind__: "ok",
    ok: {
      id: "new-faq",
      question,
      answer,
      order: BigInt(99),
      category: FaqCategory.Platform,
      helpfulCount: BigInt(0),
      notHelpfulCount: BigInt(0),
      timestamp: BigInt(Date.now() * 1_000_000),
    },
  }),

  // updateFaq now takes 5 args: token, id, question, answer, category
  updateFaq: async (
    _token: string,
    id: string,
    question: string,
    answer: string,
    _category: FaqCategory,
  ): Promise<Result_3> => ({
    __kind__: "ok",
    ok: {
      id,
      question,
      answer,
      order: BigInt(1),
      category: FaqCategory.Platform,
      helpfulCount: BigInt(0),
      notHelpfulCount: BigInt(0),
      timestamp: BigInt(Date.now() * 1_000_000),
    },
  }),

  deleteFaq: async (_token: string, _id: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  reorderFaqs: async (
    _token: string,
    _orderedIds: string[],
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  // addAnnouncement: token, title, body, category, link, isPinned, publishAt
  addAnnouncement: async (
    _token: string,
    title: string,
    body: string,
    _category: AnnouncementCategory,
    link: string | null,
    _isPinned: boolean,
    _publishAt: bigint | null,
  ): Promise<Result_5> => ({
    __kind__: "ok",
    ok: {
      id: "ann-new",
      title,
      body,
      link: link ?? undefined,
      isActive: true,
      timestamp: BigInt(Date.now() * 1_000_000),
      category: AnnouncementCategory.General,
      isPinned: false,
    },
  }),

  // updateAnnouncement
  updateAnnouncement: async (
    _token: string,
    id: string,
    title: string,
    body: string,
    _category: AnnouncementCategory,
    link: string | null,
    _isPinned: boolean,
    _isActive: boolean,
    _publishAt: bigint | null,
  ): Promise<Result_5> => ({
    __kind__: "ok",
    ok: {
      id,
      title,
      body,
      link: link ?? undefined,
      isActive: true,
      timestamp: BigInt(Date.now() * 1_000_000),
      category: AnnouncementCategory.General,
      isPinned: false,
    },
  }),

  deleteAnnouncement: async (_token: string, _id: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  pinAnnouncement: async (
    _token: string,
    _id: string,
    _pin: boolean,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  getAllAnnouncements: async (_token: string): Promise<Result_17> => ({
    __kind__: "ok",
    ok: sampleAnnouncements,
  }),

  submitNotifyMe: async (
    _name: string | null,
    _contact: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  setStatsConfig: async (
    _token: string,
    _config: StatsConfig,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  // Result_7 = { ok: Array<Signal> } | { err: string }
  getScheduledSignals: async (_token: string): Promise<Result_7> => ({
    __kind__: "ok" as const,
    ok: sampleSignals,
  }),

  importSignals: async (
    _token: string,
    _inputs: Array<SignalInput>,
  ): Promise<Result_7> => ({
    __kind__: "ok" as const,
    ok: sampleSignals,
  }),

  updateSignalSchedule: async (
    _token: string,
    id: string,
    _isDraft: boolean,
    _publishAt: bigint | null,
  ): Promise<Result_2> => ({
    __kind__: "ok",
    ok: mockSignal({
      id,
      asset: "BTC/USDT",
      marketType: MarketType.Crypto,
      direction: Direction.Buy,
      entryPrice: "62500",
      targetPrice: "68000",
      stopLoss: "59000",
      notes: "",
    }),
  }),

  // Result_15 = { ok: Array<AuditEntry> } | { err: string }
  getAuditLog: async (_token: string): Promise<Result_15> => ({
    __kind__: "ok",
    ok: [],
  }),

  // Result_16 = { ok: Analytics } | { err: string }
  getAnalytics: async (_token: string): Promise<Result_16> => ({
    __kind__: "ok",
    ok: {
      signalsByMarket: [],
      notifyMeByDate: [],
      totalNotifyMe: BigInt(0),
    },
  }),

  banEmail: async (_token: string, _email: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  unbanEmail: async (_token: string, _email: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  // Result_14 = { ok: Array<string> } | { err: string }
  getBannedEmails: async (_token: string): Promise<Result_14> => ({
    __kind__: "ok",
    ok: [],
  }),

  setSignalOfTheDay: async (
    _token: string,
    _signalId: string | null,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  getSignalOfTheDay: async (): Promise<Signal | null> => sampleSignals[0],

  getAnalyticsCsv: async (_token: string): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "date,signups\n2026-04-20,3\n2026-04-21,5",
  }),

  updateMarketSentiment: async (_token: string, _sentiment) => ({
    __kind__: "ok",
    ok: null,
  }),

  getAiProviderStatus: async (): Promise<Array<[string, boolean]>> => [
    ["default", true],
    ["gemini", false],
    ["grok", false],
    ["chatgpt", false],
    ["claude", false],
    ["perplexity", false],
    ["mistral", false],
    ["cohere", false],
    ["deepseek", false],
    ["groq", false],
    ["together", false],
    ["fireworks", false],
    ["openrouter", false],
    ["replicate", false],
    ["huggingface", false],
    ["ai21", false],
    ["nlpcloud", false],
    ["anyscale", false],
    ["cerebras", false],
    ["sambanova", false],
    ["cloudflare", false],
    ["novita", false],
    ["moonshot", false],
    ["zhipu", false],
    ["upstage", false],
  ],

  invalidateAiSession: async (_token: string): Promise<void> => undefined,

  // sendAiMessage(sessionToken, message, provider, history) — 4 args
  sendAiMessage: async (
    _sessionToken: string,
    _message: string,
    _provider: string,
    _history: ChatMessage[],
  ): Promise<Result_1> => ({
    __kind__: "err",
    err: "Not implemented in mock",
  }),

  setAiApiKey: async (
    _adminToken: string,
    _provider: string,
    _key: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  validateAiPasscode: async (_passcode: string): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "mock-ai-session-token-12345",
  }),

  validateAiSession: async (_token: string): Promise<boolean> => true,

  // Binance Feed
  addBinancePost: async (
    _adminToken: string,
    title: string,
    snippet: string,
    url: string,
    date: string,
  ): Promise<Result_4> => ({
    __kind__: "ok",
    ok: { id: "bp-new", title, snippet, url, date },
  }),

  updateBinancePost: async (
    _adminToken: string,
    id: string,
    title: string,
    snippet: string,
    url: string,
    date: string,
  ): Promise<Result_4> => ({
    __kind__: "ok",
    ok: { id, title, snippet, url, date },
  }),

  deleteBinancePost: async (
    _adminToken: string,
    _id: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  // Burn & Community
  setBurnTracker: async (
    _adminToken: string,
    _data: BurnTracker,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  setCommunityCounter: async (
    _adminToken: string,
    _data: CommunityCounter,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  // Roadmap
  setRoadmapMilestone: async (
    _adminToken: string,
    _year: string,
    _title: string,
    _description: string,
    _completed: boolean,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  // Signal archive
  getSignalArchive: async (): Promise<Signal[]> => sampleSignals,

  // Admin config
  getAdminConfig: async (_adminToken: string): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "{}",
  }),

  // FAQ init
  initFaqs: async (): Promise<void> => undefined,

  // ─── Stub implementations for new backend methods ────────────────────────

  addBurnEntry: async (
    _date: string,
    _amount: string,
    _reason: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "ok" }),

  addBurnEvent: async (
    _date: string,
    _amount: string,
    _reason: string,
    _sessionToken: string,
  ): Promise<Result_22> => ({
    __kind__: "ok",
    ok: {
      id: "burn-1",
      date: _date ?? new Date().toISOString().split("T")[0],
      amount: "0",
      reason: "mock",
      executed: false,
      createdAt: BigInt(Date.now() * 1_000_000),
    },
  }),

  addJournalEntry: async (
    _entry: JournalEntry,
    _sessionToken: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "ok" }),

  addMilestone: async (
    _title: string,
    _description: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "ok" }),

  addQuote: async (
    _quote: string,
    _author: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "ok" }),

  addTestimonial: async (
    _name: string,
    _content: string,
    _winAmount: string | null,
    _asset: string | null,
    _sessionToken: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "ok" }),

  askFaq: async (_question: string): Promise<string> =>
    "This is a mock FAQ answer. In production, the AI will answer your question.",

  askTokenFaq: async (_question: string): Promise<string> =>
    "This is a mock token FAQ answer. In production, the AI will answer your DMNZ question.",

  backtestSignal: async (
    _signal: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "Backtest result: This signal historically performed well with ~72% win rate over 30 days.",
  }),

  clearJournal: async (_sessionToken: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  createAbTest: async (
    _name: string,
    _variantA: string,
    _variantB: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "ab-1" }),

  createAuditSnapshot: async (
    _snapshotLabel: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "snapshot-1",
  }),

  createPushNotification: async (
    _title: string,
    _body: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "notif-1",
  }),

  deleteQuote: async (
    _id: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  deleteTestimonial: async (
    _id: string,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  dismissPushNotification: async (_id: string): Promise<void> => undefined,

  generateDailyBriefing: async (_sessionToken: string): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "📊 **DemonZeno Daily Briefing** — Markets are showing mixed signals today. BTC consolidating at key support. ETH showing bullish divergence. Stay patient and wait for clean setups.",
  }),

  // Result_19 = { ok: Array<AbTest> } | { err: string }
  getAbTests: async (_sessionToken: string): Promise<Result_19> => ({
    __kind__: "ok",
    ok: [],
  }),

  getAbVariant: async (_testId: string): Promise<string> => "A",

  getActivePushNotifications: async (): Promise<Array<PushNotification>> => [],

  // Result_18 = { ok: Array<ActivityEntry> } | { err: string }
  getAdminActivityHeatmap: async (_sessionToken: string): Promise<Result_18> => ({
    __kind__: "ok",
    ok: [] as ActivityEntry[],
  }),

  getAiLanguage: async (_sessionToken: string): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "en",
  }),

  getBurnSchedule: async (): Promise<Array<BurnScheduleEntry>> => [],

  getDailyBriefing: async (): Promise<string> =>
    "📊 **DemonZeno Daily Briefing** — Check back later for today's market analysis.",

  getHolderBenefits: async (): Promise<Array<HolderBenefit>> => [],

  // Result_13 = { ok: Array<JournalEntry> } | { err: string }
  getJournalEntries: async (_sessionToken: string): Promise<Result_13> => ({
    __kind__: "ok",
    ok: [],
  }),

  getMaintenanceMode: async (): Promise<MaintenanceMode> => ({
    enabled: false,
    message: "",
    updatedAt: BigInt(0),
  }),

  getMarketMoodBanner: async (): Promise<MarketMoodBanner | null> => null,

  getMilestones: async (): Promise<Array<CommunityMilestone>> => [],

  getPublicBurnSchedule: async (): Promise<Array<BurnScheduleEntry>> => [],

  getQuotes: async (): Promise<Array<DemonZenoQuote>> => [],

  // Result_11 = { ok: Array<ResponseRating> } | { err: string }
  getSessionRatings: async (_sessionToken: string): Promise<Result_11> => ({
    __kind__: "ok",
    ok: [] as ResponseRating[],
  }),

  getSessionRecap: async (
    _history: Array<ChatMessage>,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "Session Recap: No signals generated in this session yet.",
  }),

  getSignalOfWeek: async (): Promise<SignalOfWeekFull | null> => null,

  // Result_10 = { ok: SignalPerformanceStats } | { err: string }
  getSignalPerformanceStats: async (
    _sessionToken: string,
  ): Promise<Result_10> => ({
    __kind__: "ok",
    ok: {
      totalSignals: BigInt(100),
      wins: BigInt(87),
      losses: BigInt(13),
      pending: BigInt(3),
      winRate: 87.0,
      topAssets: [],
      weeklyTrend: [],
    } as SignalPerformanceStats,
  }),

  getTestimonials: async (): Promise<Array<Testimonial>> => [],

  getWhitepaper: async (): Promise<WhitepaperContent> => ({
    title: "DemonZeno — DMNZ Token Whitepaper",
    updatedAt: BigInt(Date.now() * 1_000_000),
    sections: [],
  }),

  // Result_6 = { ok: Array<AuditSnapshot> } | { err: string }
  listAuditSnapshots: async (_sessionToken: string): Promise<Result_6> => ({
    __kind__: "ok",
    ok: [],
  }),

  markMilestoneReached: async (
    _id: string,
    _celebrateDays: bigint,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  rateAiResponse: async (
    _messageId: string,
    _rating: bigint,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  recordAbImpression: async (
    _testId: string,
    _variant: string,
  ): Promise<void> => undefined,

  recordAdminActivity: async (
    _action: string,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  publishScheduledSignals: async (): Promise<bigint> => BigInt(0),

  scheduleSignal: async (
    _signalId: string,
    _publishAt: bigint,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  setAiLanguage: async (
    _lang: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  setMaintenanceMode: async (
    _enabled: boolean,
    _message: string,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  setMarketMoodBanner: async (
    _mood: string,
    _message: string,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  setSignalOfWeek: async (
    _signalId: string,
    _comment: string,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  setSignalOfWeekWithDate: async (
    _signalId: string,
    _comment: string,
    _weekOf: string,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  updateBurnEntryStatus: async (
    _id: string,
    _status: string,
    _txHash: string | null,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  updateWhitepaper: async (
    _content: WhitepaperContent,
    _sessionToken: string,
  ): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  validateAdminRole: async (_passcode: string): Promise<string | null> => null,

  // Additional methods from backendInterface
  addHypeMilestone: async (
    _title: string,
    _targetCount: bigint,
    _sessionToken: string,
  ): Promise<Result_21> => ({
    __kind__: "ok",
    ok: {
      id: "hype-1",
      title: _title ?? "Milestone",
      achieved: false,
      order: BigInt(1),
      targetCount: _targetCount ?? BigInt(1000),
    },
  }),

  addSignalNote: async (
    _sessionToken: string,
    _id: string,
    _note: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  addSignalTemplate: async (
    _sessionToken: string,
    _name: string,
    _asset: string,
    _marketType: MarketType,
    _direction: Direction,
    _timeframe: Timeframe,
    _confidence: Confidence,
    _notes: string,
  ): Promise<{ __kind__: "ok"; ok: SignalTemplate } | { __kind__: "err"; err: string }> => ({
    __kind__: "ok",
    ok: {
      id: "tpl-1",
      name: _name ?? "Template",
      asset: _asset ?? "BTC/USDT",
      marketType: _marketType ?? MarketType.Crypto,
      direction: _direction ?? Direction.Buy,
      timeframe: _timeframe ?? Timeframe.Swing,
      confidence: _confidence ?? Confidence.Medium,
      notes: _notes ?? "",
      createdAt: BigInt(Date.now() * 1_000_000),
    },
  }),

  addTopTrader: async (
    _name: string,
    _bio: string,
    _achievement: string,
    _week: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "ok" }),

  analyzeNewsImpact: async (
    _headline: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "News impact analysis: Moderately bullish. The headline suggests positive market sentiment.",
  }),

  compareSignals: async (
    _asset1: string,
    _asset2: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "Signal comparison: Both assets show similar momentum. BTC has higher volume confirmation.",
  }),

  deleteCommunityQuestion: async (
    _id: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  deleteSignalTemplate: async (
    _sessionToken: string,
    _id: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  deleteTopTrader: async (
    _id: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  executeAdminCommand: async (
    _sessionToken: string,
    _command: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "Command executed" }),

  generatePostTradeAnalysis: async (
    _signal: string,
    _outcome: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "Post-trade analysis: The trade followed the plan. Entry was clean, exit was managed well.",
  }),

  generatePricePrediction: async (
    _asset: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "Price prediction (AI estimate, not financial advice): Short-term upside probable based on technicals.",
  }),

  generateSignalChain: async (
    _asset: string,
    _sessionToken: string,
  ): Promise<Result_1> => ({
    __kind__: "ok",
    ok: "Signal chain: Entry → Manage to TP1 → Move SL to BE → Target TP2 → Final exit at TP3.",
  }),

  getCommunityQuestions: async (): Promise<Array<CommunityQuestion>> => [],

  getFaqsByCategory: async (
    _category: FaqCategory,
  ): Promise<Array<FAQ>> => sampleFaqs,

  getHypeMilestones: async (): Promise<Array<HypeMilestone>> => [],

  getSignalTemplates: async (_sessionToken: string): Promise<Result_9> => ({
    __kind__: "ok",
    ok: [] as SignalTemplate[],
  }),

  getTokenBurnSchedule: async (): Promise<Array<BurnEvent>> => [],

  getTokenData: async (): Promise<TokenData> => ({
    name: "DemonZeno",
    ticker: "DMNZ",
    supply: "1,000,000,000",
    launchDate: "April 2, 2028",
    launchPlatform: "Blum (Telegram Mini App)",
    burnedAmount: "0",
  }),

  getTopTraders: async (): Promise<Array<TopTrader>> => [],

  getWhitepaperUrl: async (): Promise<string | null> => null,

  markBurnEventExecuted: async (
    _id: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  markHypeMilestoneAchieved: async (
    _id: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  pinCommunityQuestion: async (
    _id: string,
    _answer: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  rateFaq: async (_id: string, _helpful: boolean): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  rollbackAdminAction: async (
    _sessionToken: string,
    _entryId: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "Rollback successful" }),

  setWhitepaperUrl: async (
    _url: string,
    _sessionToken: string,
  ): Promise<Result> => ({ __kind__: "ok", ok: null }),

  submitCommunityQuestion: async (
    _question: string,
  ): Promise<Result_1> => ({ __kind__: "ok", ok: "question-1" }),

  voteCommunityQuestion: async (_id: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),

  voteOnSignal: async (_id: string, _direction: string): Promise<Result> => ({
    __kind__: "ok",
    ok: null,
  }),
};
