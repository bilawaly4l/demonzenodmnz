import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Signal {
    id: string;
    tp1: string;
    tp2: string;
    tp3: string;
    result: ResultStatus;
    marketType: MarketType;
    direction: Direction;
    voteDown: bigint;
    asset: string;
    timeframe: Timeframe;
    providerLabel: string;
    templateId?: string;
    publishAt?: bigint;
    tags: Array<string>;
    targetPrice: string;
    voteUp: bigint;
    isDraft: boolean;
    datePosted: string;
    stopLoss: string;
    sourceLabel: string;
    notes: string;
    entryPrice: string;
    expiry?: bigint;
    confidence: Confidence;
}
export interface MarketSentiment {
    assets: Array<AssetSentiment>;
    updatedAt: bigint;
    overall: SentimentLevel;
}
export interface TopTrader {
    id: string;
    bio: string;
    name: string;
    createdAt: bigint;
    week: string;
    achievement: string;
    isActive: boolean;
}
export type Result_2 = {
    __kind__: "ok";
    ok: Signal;
} | {
    __kind__: "err";
    err: string;
};
export interface FAQ {
    id: string;
    question: string;
    order: bigint;
    answer: string;
    notHelpfulCount: bigint;
    timestamp: bigint;
    category: FaqCategory;
    helpfulCount: bigint;
}
export interface WhitepaperSection {
    title: string;
    content: string;
}
export interface DateCount {
    date: string;
    count: bigint;
}
export interface AbTest {
    id: string;
    active: boolean;
    name: string;
    variantA: string;
    variantB: string;
    impressionsA: bigint;
    impressionsB: bigint;
}
export interface Stats {
    active: bigint;
    wins: bigint;
    losses: bigint;
    assetsCovered: bigint;
    winRate: number;
    totalSignals: bigint;
}
export interface AuditEntry {
    id: string;
    action: string;
    rollbackData?: string;
    adminToken: string;
    timestamp: bigint;
    details: string;
}
export type Result_5 = {
    __kind__: "ok";
    ok: Announcement;
} | {
    __kind__: "err";
    err: string;
};
export interface BinancePost {
    id: string;
    url: string;
    title: string;
    date: string;
    snippet: string;
}
export type Result_4 = {
    __kind__: "ok";
    ok: BinancePost;
} | {
    __kind__: "err";
    err: string;
};
export interface Analytics {
    signalsByMarket: Array<MarketCount>;
    notifyMeByDate: Array<DateCount>;
    totalNotifyMe: bigint;
}
export interface CommunityMilestone {
    id: string;
    reached: boolean;
    celebrateUntil?: bigint;
    title: string;
    description: string;
    reachedAt?: bigint;
}
export type Result_7 = {
    __kind__: "ok";
    ok: Array<Signal>;
} | {
    __kind__: "err";
    err: string;
};
export interface ChatMessage {
    content: string;
    provider?: string;
    role: string;
    timestamp: bigint;
}
export interface WhitepaperContent {
    title: string;
    updatedAt: bigint;
    sections: Array<WhitepaperSection>;
}
export interface AssetStats {
    asset: string;
    wins: bigint;
    losses: bigint;
}
export interface PriceData {
    trend: string;
    asset: string;
    updatedAt: bigint;
    priceChange24h: number;
    price: number;
}
export interface StatsConfig {
    useManual: boolean;
    manualStats?: Stats;
}
export type Result_6 = {
    __kind__: "ok";
    ok: Array<AuditSnapshot>;
} | {
    __kind__: "err";
    err: string;
};
export interface SignalInput {
    tp1: string;
    tp2: string;
    tp3: string;
    marketType: MarketType;
    direction: Direction;
    asset: string;
    timeframe: Timeframe;
    providerLabel: string;
    templateId?: string;
    publishAt?: bigint;
    tags: Array<string>;
    targetPrice: string;
    isDraft: boolean;
    stopLoss: string;
    sourceLabel: string;
    notes: string;
    entryPrice: string;
    expiry?: bigint;
    confidence: Confidence;
}
export interface TokenData {
    ticker: string;
    burnedAmount: string;
    name: string;
    launchPlatform: string;
    supply: string;
    launchDate: string;
}
export interface ResponseRating {
    messageId: string;
    timestamp: bigint;
    rating: bigint;
}
export interface HypeMilestone {
    id: string;
    achieved: boolean;
    title: string;
    order: bigint;
    achievedAt?: bigint;
    targetCount: bigint;
}
export type Result_12 = {
    __kind__: "ok";
    ok: Array<NotifyMe>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_9 = {
    __kind__: "ok";
    ok: Array<SignalTemplate>;
} | {
    __kind__: "err";
    err: string;
};
export interface NotifyMe {
    id: string;
    contact: string;
    dateSubmitted: string;
    name?: string;
}
export interface HolderBenefit {
    id: string;
    title: string;
    active: boolean;
    icon: string;
    description: string;
}
export interface CommunityCounter {
    lastUpdated: bigint;
    binanceCount: bigint;
    twitterCount: bigint;
}
export interface MarketCount {
    count: bigint;
    market: string;
}
export interface AuditSnapshot {
    id: string;
    createdAt: bigint;
    dataHash: string;
    snapshotLabel: string;
}
export interface DayStats {
    day: string;
    wins: bigint;
    losses: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Result_10 = {
    __kind__: "ok";
    ok: SignalPerformanceStats;
} | {
    __kind__: "err";
    err: string;
};
export type Result_8 = {
    __kind__: "ok";
    ok: StatsConfig;
} | {
    __kind__: "err";
    err: string;
};
export interface PushNotification {
    id: string;
    title: string;
    active: boolean;
    expiresAt?: bigint;
    body: string;
    createdAt: bigint;
}
export interface SignalTemplate {
    id: string;
    marketType: MarketType;
    direction: Direction;
    asset: string;
    timeframe: Timeframe;
    name: string;
    createdAt: bigint;
    notes: string;
    confidence: Confidence;
}
export interface BurnScheduleEntry {
    id: string;
    status: string;
    date: string;
    txHash?: string;
    amount: string;
    reason: string;
}
export interface DemonZenoQuote {
    id: string;
    active: boolean;
    quote: string;
    author: string;
}
export type Result_17 = {
    __kind__: "ok";
    ok: Array<Announcement>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_13 = {
    __kind__: "ok";
    ok: Array<JournalEntry>;
} | {
    __kind__: "err";
    err: string;
};
export interface MarketMoodBanner {
    active: boolean;
    mood: string;
    updatedAt: bigint;
    message: string;
}
export type Result_16 = {
    __kind__: "ok";
    ok: Analytics;
} | {
    __kind__: "err";
    err: string;
};
export type Result_1 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface AssetSentiment {
    trend: string;
    asset: string;
    note: string;
    lastPriceUpdate: bigint;
    level: SentimentLevel;
    updatedAt: bigint;
    priceChange24h: number;
    market: string;
    price: number;
}
export type Result_22 = {
    __kind__: "ok";
    ok: BurnEvent;
} | {
    __kind__: "err";
    err: string;
};
export type Result_11 = {
    __kind__: "ok";
    ok: Array<ResponseRating>;
} | {
    __kind__: "err";
    err: string;
};
export interface SignalOfWeekFull {
    featuredAt: bigint;
    comment: string;
    signal: Signal;
    weekOf: string;
}
export type Result_19 = {
    __kind__: "ok";
    ok: Array<AbTest>;
} | {
    __kind__: "err";
    err: string;
};
export interface SignalPerformanceStats {
    topAssets: Array<AssetStats>;
    pending: bigint;
    wins: bigint;
    losses: bigint;
    weeklyTrend: Array<DayStats>;
    winRate: number;
    totalSignals: bigint;
}
export interface Announcement {
    id: string;
    title: string;
    body: string;
    link?: string;
    publishAt?: bigint;
    isActive: boolean;
    timestamp: bigint;
    category: AnnouncementCategory;
    isPinned: boolean;
}
export type Result_14 = {
    __kind__: "ok";
    ok: Array<string>;
} | {
    __kind__: "err";
    err: string;
};
export interface CommunityQuestion {
    id: string;
    question: string;
    votes: bigint;
    answer?: string;
    isActive: boolean;
    timestamp: bigint;
    isPinned: boolean;
}
export interface RoadmapMilestone {
    title: string;
    completed: boolean;
    year: string;
    description: string;
}
export interface BurnEvent {
    id: string;
    date: string;
    createdAt: bigint;
    executed: boolean;
    amount: string;
    reason: string;
}
export type Result_21 = {
    __kind__: "ok";
    ok: HypeMilestone;
} | {
    __kind__: "err";
    err: string;
};
export type Result_18 = {
    __kind__: "ok";
    ok: Array<ActivityEntry>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_3 = {
    __kind__: "ok";
    ok: FAQ;
} | {
    __kind__: "err";
    err: string;
};
export interface JournalEntry {
    id: string;
    pnl?: number;
    direction: string;
    asset: string;
    lots: number;
    notes: string;
    timestamp: bigint;
    entryPrice: number;
    exitPrice?: number;
}
export type Result_15 = {
    __kind__: "ok";
    ok: Array<AuditEntry>;
} | {
    __kind__: "err";
    err: string;
};
export interface MaintenanceMode {
    enabled: boolean;
    updatedAt: bigint;
    message: string;
}
export interface BurnTracker {
    lastUpdated: bigint;
    totalBurned: bigint;
}
export interface ActivityEntry {
    dayOfWeek: bigint;
    hour: bigint;
    count: bigint;
}
export type Result_20 = {
    __kind__: "ok";
    ok: SignalTemplate;
} | {
    __kind__: "err";
    err: string;
};
export interface Testimonial {
    id: string;
    active: boolean;
    content: string;
    asset?: string;
    name: string;
    createdAt: bigint;
    winAmount?: string;
}
export enum AnnouncementCategory {
    General = "General",
    Token = "Token",
    Admin = "Admin",
    Alert = "Alert",
    Signal = "Signal"
}
export enum Confidence {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export enum Direction {
    Buy = "Buy",
    Sell = "Sell"
}
export enum FaqCategory {
    Signals = "Signals",
    Platform = "Platform",
    GeneralTrading = "GeneralTrading",
    DmnzToken = "DmnzToken"
}
export enum MarketType {
    Stock = "Stock",
    Forex = "Forex",
    Crypto = "Crypto"
}
export enum ResultStatus {
    Win = "Win",
    Loss = "Loss",
    Active = "Active",
    Expired = "Expired"
}
export enum SentimentLevel {
    Bearish = "Bearish",
    Neutral = "Neutral",
    Bullish = "Bullish"
}
export enum Timeframe {
    Scalp = "Scalp",
    Swing = "Swing",
    LongTerm = "LongTerm"
}
export interface backendInterface {
    addAnnouncement(sessionToken: string, title: string, body: string, category: AnnouncementCategory, link: string | null, isPinned: boolean, publishAt: bigint | null): Promise<Result_5>;
    addBinancePost(adminToken: string, title: string, snippet: string, url: string, date: string): Promise<Result_4>;
    addBurnEntry(date: string, amount: string, reason: string, sessionToken: string): Promise<Result_1>;
    addBurnEvent(date: string, amount: string, reason: string, sessionToken: string): Promise<Result_22>;
    addFaq(sessionToken: string, question: string, answer: string, category: FaqCategory): Promise<Result_3>;
    addHypeMilestone(title: string, targetCount: bigint, sessionToken: string): Promise<Result_21>;
    addJournalEntry(entry: JournalEntry, sessionToken: string): Promise<Result_1>;
    addMilestone(title: string, description: string, sessionToken: string): Promise<Result_1>;
    addQuote(quote: string, author: string, sessionToken: string): Promise<Result_1>;
    addSignal(sessionToken: string, asset: string, marketType: MarketType, direction: Direction, entryPrice: string, targetPrice: string, stopLoss: string, tp1: string, tp2: string, tp3: string, notes: string, confidence: Confidence, sourceLabel: string, providerLabel: string, expiry: bigint | null, timeframe: Timeframe, isDraft: boolean, publishAt: bigint | null, templateId: string | null, tags: Array<string>): Promise<Result_2>;
    addSignalNote(sessionToken: string, id: string, note: string): Promise<Result>;
    addSignalTemplate(sessionToken: string, name: string, asset: string, marketType: MarketType, direction: Direction, timeframe: Timeframe, confidence: Confidence, notes: string): Promise<Result_20>;
    addTestimonial(name: string, content: string, winAmount: string | null, asset: string | null, sessionToken: string): Promise<Result_1>;
    addTopTrader(name: string, bio: string, achievement: string, week: string, sessionToken: string): Promise<Result_1>;
    analyzeNewsImpact(headline: string, sessionToken: string): Promise<Result_1>;
    askFaq(question: string): Promise<string>;
    askTokenFaq(question: string): Promise<string>;
    backtestSignal(signal: string, sessionToken: string): Promise<Result_1>;
    banEmail(sessionToken: string, email: string): Promise<Result>;
    clearJournal(sessionToken: string): Promise<Result>;
    compareSignals(asset1: string, asset2: string, sessionToken: string): Promise<Result_1>;
    createAbTest(name: string, variantA: string, variantB: string, sessionToken: string): Promise<Result_1>;
    createAuditSnapshot(snapshotLabel: string, sessionToken: string): Promise<Result_1>;
    createPushNotification(title: string, body: string, sessionToken: string): Promise<Result_1>;
    deleteAnnouncement(sessionToken: string, id: string): Promise<Result>;
    deleteBinancePost(adminToken: string, id: string): Promise<Result>;
    deleteCommunityQuestion(id: string, sessionToken: string): Promise<Result>;
    deleteFaq(sessionToken: string, id: string): Promise<Result>;
    deleteQuote(id: string, sessionToken: string): Promise<Result>;
    deleteSignal(sessionToken: string, id: string): Promise<Result>;
    deleteSignalTemplate(sessionToken: string, id: string): Promise<Result>;
    deleteTestimonial(id: string, sessionToken: string): Promise<Result>;
    deleteTopTrader(id: string, sessionToken: string): Promise<Result>;
    dismissPushNotification(id: string): Promise<void>;
    executeAdminCommand(sessionToken: string, command: string): Promise<Result_1>;
    generateDailyBriefing(sessionToken: string): Promise<Result_1>;
    generatePostTradeAnalysis(signal: string, outcome: string, sessionToken: string): Promise<Result_1>;
    generatePricePrediction(asset: string, sessionToken: string): Promise<Result_1>;
    generateSignalChain(asset: string, sessionToken: string): Promise<Result_1>;
    getAbTests(sessionToken: string): Promise<Result_19>;
    getAbVariant(testId: string): Promise<string>;
    getActivePushNotifications(): Promise<Array<PushNotification>>;
    getAdminActivityHeatmap(sessionToken: string): Promise<Result_18>;
    getAdminConfig(adminToken: string): Promise<Result_1>;
    getAiLanguage(sessionToken: string): Promise<Result_1>;
    getAiProviderStatus(): Promise<Array<[string, boolean]>>;
    getAllAnnouncements(sessionToken: string): Promise<Result_17>;
    getAnalytics(sessionToken: string): Promise<Result_16>;
    getAnalyticsCsv(sessionToken: string): Promise<Result_1>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getAuditLog(sessionToken: string): Promise<Result_15>;
    getBannedEmails(sessionToken: string): Promise<Result_14>;
    getBinanceFeed(): Promise<Array<BinancePost>>;
    getBurnSchedule(): Promise<Array<BurnScheduleEntry>>;
    getBurnTracker(): Promise<BurnTracker>;
    getCommunityCounter(): Promise<CommunityCounter>;
    getCommunityQuestions(): Promise<Array<CommunityQuestion>>;
    getDailyBriefing(): Promise<string>;
    getFaqs(): Promise<Array<FAQ>>;
    getFaqsByCategory(category: FaqCategory): Promise<Array<FAQ>>;
    getHolderBenefits(): Promise<Array<HolderBenefit>>;
    getHypeMilestones(): Promise<Array<HypeMilestone>>;
    getJournalEntries(sessionToken: string): Promise<Result_13>;
    getMaintenanceMode(): Promise<MaintenanceMode>;
    getMarketMoodBanner(): Promise<MarketMoodBanner | null>;
    getMarketPrices(): Promise<Array<PriceData>>;
    getMarketSentiment(): Promise<MarketSentiment>;
    getMilestones(): Promise<Array<CommunityMilestone>>;
    getNotifyMeList(sessionToken: string): Promise<Result_12>;
    getPublicBurnSchedule(): Promise<Array<BurnScheduleEntry>>;
    getQuotes(): Promise<Array<DemonZenoQuote>>;
    getRoadmap(): Promise<Array<RoadmapMilestone>>;
    getScheduledSignals(sessionToken: string): Promise<Result_7>;
    getSessionRatings(sessionToken: string): Promise<Result_11>;
    getSessionRecap(history: Array<ChatMessage>, sessionToken: string): Promise<Result_1>;
    getSignalArchive(): Promise<Array<Signal>>;
    getSignalOfTheDay(): Promise<Signal | null>;
    getSignalOfWeek(): Promise<SignalOfWeekFull | null>;
    getSignalPerformanceStats(sessionToken: string): Promise<Result_10>;
    getSignalTemplates(sessionToken: string): Promise<Result_9>;
    getSignals(): Promise<Array<Signal>>;
    getStats(): Promise<Stats>;
    getStatsConfig(sessionToken: string): Promise<Result_8>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getTokenBurnSchedule(): Promise<Array<BurnEvent>>;
    getTokenData(): Promise<TokenData>;
    getTopTraders(): Promise<Array<TopTrader>>;
    getWhitepaper(): Promise<WhitepaperContent>;
    getWhitepaperUrl(): Promise<string | null>;
    importSignals(sessionToken: string, inputs: Array<SignalInput>): Promise<Result_7>;
    initFaqs(): Promise<void>;
    invalidateAiSession(token: string): Promise<void>;
    invalidateSession(token: string): Promise<void>;
    listAuditSnapshots(sessionToken: string): Promise<Result_6>;
    markBurnEventExecuted(id: string, sessionToken: string): Promise<Result>;
    markHypeMilestoneAchieved(id: string, sessionToken: string): Promise<Result>;
    markMilestoneReached(id: string, celebrateDays: bigint, sessionToken: string): Promise<Result>;
    pinAnnouncement(sessionToken: string, id: string, pin: boolean): Promise<Result>;
    pinCommunityQuestion(id: string, answer: string, sessionToken: string): Promise<Result>;
    publishScheduledSignals(): Promise<bigint>;
    rateAiResponse(messageId: string, rating: bigint, sessionToken: string): Promise<Result>;
    rateFaq(id: string, helpful: boolean): Promise<Result>;
    recordAbImpression(testId: string, variant: string): Promise<void>;
    recordAdminActivity(action: string, sessionToken: string): Promise<Result>;
    refreshMarketPrices(): Promise<Array<PriceData>>;
    reorderFaqs(sessionToken: string, orderedIds: Array<string>): Promise<Result>;
    rollbackAdminAction(sessionToken: string, entryId: string): Promise<Result_1>;
    scheduleSignal(signalId: string, publishAt: bigint, sessionToken: string): Promise<Result>;
    sendAiMessage(sessionToken: string, message: string, provider: string, history: Array<ChatMessage>): Promise<Result_1>;
    setAiApiKey(adminToken: string, provider: string, key: string): Promise<Result>;
    setAiLanguage(lang: string, sessionToken: string): Promise<Result>;
    setBurnTracker(adminToken: string, data: BurnTracker): Promise<Result>;
    setCommunityCounter(adminToken: string, data: CommunityCounter): Promise<Result>;
    setMaintenanceMode(enabled: boolean, message: string, sessionToken: string): Promise<Result>;
    setMarketMoodBanner(mood: string, message: string, sessionToken: string): Promise<Result>;
    setRoadmapMilestone(adminToken: string, year: string, title: string, description: string, completed: boolean): Promise<Result>;
    setSignalOfTheDay(sessionToken: string, signalId: string | null): Promise<Result>;
    setSignalOfWeek(signalId: string, comment: string, sessionToken: string): Promise<Result>;
    setSignalOfWeekWithDate(signalId: string, comment: string, weekOf: string, sessionToken: string): Promise<Result>;
    setStatsConfig(sessionToken: string, config: StatsConfig): Promise<Result>;
    setWhitepaperUrl(url: string, sessionToken: string): Promise<Result>;
    submitCommunityQuestion(question: string): Promise<Result_1>;
    submitNotifyMe(name: string | null, contact: string): Promise<Result>;
    unbanEmail(sessionToken: string, email: string): Promise<Result>;
    updateAnnouncement(sessionToken: string, id: string, title: string, body: string, category: AnnouncementCategory, link: string | null, isPinned: boolean, isActive: boolean, publishAt: bigint | null): Promise<Result_5>;
    updateBinancePost(adminToken: string, id: string, title: string, snippet: string, url: string, date: string): Promise<Result_4>;
    updateBurnEntryStatus(id: string, status: string, txHash: string | null, sessionToken: string): Promise<Result>;
    updateFaq(sessionToken: string, id: string, question: string, answer: string, category: FaqCategory): Promise<Result_3>;
    updateMarketSentiment(token: string, sentiment: MarketSentiment): Promise<Result>;
    updateSignal(sessionToken: string, id: string, asset: string, marketType: MarketType, direction: Direction, entryPrice: string, targetPrice: string, stopLoss: string, tp1: string, tp2: string, tp3: string, notes: string, confidence: Confidence, sourceLabel: string, providerLabel: string, expiry: bigint | null, timeframe: Timeframe, isDraft: boolean, publishAt: bigint | null, templateId: string | null, tags: Array<string>): Promise<Result_2>;
    updateSignalResult(sessionToken: string, id: string, result: ResultStatus): Promise<Result_2>;
    updateSignalSchedule(sessionToken: string, id: string, isDraft: boolean, publishAt: bigint | null): Promise<Result_2>;
    updateWhitepaper(content: WhitepaperContent, sessionToken: string): Promise<Result>;
    validateAdminRole(passcode: string): Promise<string | null>;
    validateAiPasscode(passcode: string): Promise<Result_1>;
    validateAiSession(token: string): Promise<boolean>;
    validatePasscode(passcode: string): Promise<Result_1>;
    validateSession(token: string): Promise<boolean>;
    voteCommunityQuestion(id: string): Promise<Result>;
    voteOnSignal(id: string, direction: string): Promise<Result>;
}
