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
    result: ResultStatus;
    marketType: MarketType;
    direction: Direction;
    asset: string;
    timeframe: Timeframe;
    publishAt?: bigint;
    targetPrice: string;
    isDraft: boolean;
    datePosted: string;
    stopLoss: string;
    sourceLabel: string;
    notes: string;
    entryPrice: string;
    expiry?: bigint;
    confidence: Confidence;
}
export interface FAQ {
    id: string;
    question: string;
    order: bigint;
    answer: string;
}
export type Result_2 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface DateCount {
    date: string;
    count: bigint;
}
export interface Testimonial {
    id: string;
    active: boolean;
    content: string;
    asset?: string;
    name: string;
    createdAt: bigint;
    winAmount?: string;
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
    timestamp: bigint;
    details: string;
}
export type Result_5 = {
    __kind__: "ok";
    ok: BinancePost;
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
    ok: FAQ;
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
    ok: Announcement;
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
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export interface SignalInput {
    marketType: MarketType;
    direction: Direction;
    asset: string;
    timeframe: Timeframe;
    publishAt?: bigint;
    targetPrice: string;
    isDraft: boolean;
    stopLoss: string;
    sourceLabel: string;
    notes: string;
    entryPrice: string;
    expiry?: bigint;
    confidence: Confidence;
}
export interface ResponseRating {
    messageId: string;
    timestamp: bigint;
    rating: bigint;
}
export type Result_12 = {
    __kind__: "ok";
    ok: Array<ResponseRating>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_9 = {
    __kind__: "ok";
    ok: Array<Signal>;
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
export interface AuditSnapshot {
    id: string;
    createdAt: bigint;
    dataHash: string;
    snapshotLabel: string;
}
export interface MarketCount {
    count: bigint;
    market: string;
}
export type Result = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export type Result_10 = {
    __kind__: "ok";
    ok: StatsConfig;
} | {
    __kind__: "err";
    err: string;
};
export interface DayStats {
    day: string;
    wins: bigint;
    losses: bigint;
}
export type Result_8 = {
    __kind__: "ok";
    ok: Array<AuditSnapshot>;
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
    ok: Analytics;
} | {
    __kind__: "err";
    err: string;
};
export type Result_13 = {
    __kind__: "ok";
    ok: Array<NotifyMe>;
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
    ok: Array<AuditEntry>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_1 = {
    __kind__: "ok";
    ok: [string, string];
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
export type Result_11 = {
    __kind__: "ok";
    ok: SignalPerformanceStats;
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
    link?: string;
    publishAt?: bigint;
    text: string;
    isActive: boolean;
}
export type Result_14 = {
    __kind__: "ok";
    ok: Array<JournalEntry>;
} | {
    __kind__: "err";
    err: string;
};
export interface RoadmapMilestone {
    title: string;
    completed: boolean;
    year: string;
    description: string;
}
export type Result_18 = {
    __kind__: "ok";
    ok: Array<ActivityEntry>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_3 = {
    __kind__: "ok";
    ok: Signal;
} | {
    __kind__: "err";
    err: string;
};
export interface JournalEntry {
    id: string;
    pnl?: number;
    notes: string;
    timestamp: bigint;
    entryPrice: number;
    signal: string;
    exitPrice?: number;
}
export type Result_15 = {
    __kind__: "ok";
    ok: Array<string>;
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
export interface WhitepaperSection {
    title: string;
    content: string;
}
export interface MarketSentiment {
    assets: Array<AssetSentiment>;
    updatedAt: bigint;
    overall: SentimentLevel;
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
    addBinancePost(adminToken: string, title: string, snippet: string, url: string, date: string): Promise<Result_5>;
    addBurnEntry(date: string, amount: string, reason: string, sessionToken: string): Promise<Result>;
    addFaq(sessionToken: string, question: string, answer: string): Promise<Result_4>;
    addJournalEntry(entry: JournalEntry, sessionToken: string): Promise<Result>;
    addMilestone(title: string, description: string, sessionToken: string): Promise<Result>;
    addQuote(quote: string, author: string, sessionToken: string): Promise<Result>;
    addSignal(sessionToken: string, asset: string, marketType: MarketType, direction: Direction, entryPrice: string, targetPrice: string, stopLoss: string, notes: string, confidence: Confidence, sourceLabel: string, expiry: bigint | null, timeframe: Timeframe, isDraft: boolean, publishAt: bigint | null): Promise<Result_3>;
    addTestimonial(name: string, content: string, winAmount: string | null, asset: string | null, sessionToken: string): Promise<Result>;
    askFaq(question: string): Promise<string>;
    backtestSignal(signal: string, sessionToken: string): Promise<Result>;
    banEmail(sessionToken: string, email: string): Promise<Result_2>;
    checkAdminUnlockPhrase(message: string): Promise<string | null>;
    clearJournal(sessionToken: string): Promise<Result_2>;
    createAbTest(name: string, variantA: string, variantB: string, sessionToken: string): Promise<Result>;
    createAuditSnapshot(snapshotLabel: string, sessionToken: string): Promise<Result>;
    createPushNotification(title: string, body: string, sessionToken: string): Promise<Result>;
    deleteBinancePost(adminToken: string, id: string): Promise<Result_2>;
    deleteFaq(sessionToken: string, id: string): Promise<Result_2>;
    deleteQuote(id: string, sessionToken: string): Promise<Result_2>;
    deleteSignal(sessionToken: string, id: string): Promise<Result_2>;
    deleteTestimonial(id: string, sessionToken: string): Promise<Result_2>;
    dismissPushNotification(id: string): Promise<void>;
    generateDailyBriefing(sessionToken: string): Promise<Result>;
    getAbTests(sessionToken: string): Promise<Result_19>;
    getAbVariant(testId: string): Promise<string>;
    getActivePushNotifications(): Promise<Array<PushNotification>>;
    getAdminActivityHeatmap(sessionToken: string): Promise<Result_18>;
    getAdminConfig(adminToken: string): Promise<Result>;
    getAiLanguage(sessionToken: string): Promise<Result>;
    getAiProviderStatus(): Promise<Array<[string, boolean]>>;
    getAnalytics(sessionToken: string): Promise<Result_17>;
    getAnalyticsCsv(sessionToken: string): Promise<Result>;
    getAnnouncement(): Promise<Announcement | null>;
    getAuditLog(sessionToken: string): Promise<Result_16>;
    getBannedEmails(sessionToken: string): Promise<Result_15>;
    getBinanceFeed(): Promise<Array<BinancePost>>;
    getBurnSchedule(): Promise<Array<BurnScheduleEntry>>;
    getBurnTracker(): Promise<BurnTracker>;
    getCommunityCounter(): Promise<CommunityCounter>;
    getDailyBriefing(): Promise<string>;
    getFaqs(): Promise<Array<FAQ>>;
    getHolderBenefits(): Promise<Array<HolderBenefit>>;
    getJournalEntries(sessionToken: string): Promise<Result_14>;
    getMaintenanceMode(): Promise<MaintenanceMode>;
    getMarketMoodBanner(): Promise<MarketMoodBanner | null>;
    getMarketPrices(): Promise<Array<PriceData>>;
    getMarketSentiment(): Promise<MarketSentiment>;
    getMilestones(): Promise<Array<CommunityMilestone>>;
    getNotifyMeList(sessionToken: string): Promise<Result_13>;
    getPublicBurnSchedule(): Promise<Array<BurnScheduleEntry>>;
    getQuotes(): Promise<Array<DemonZenoQuote>>;
    getRoadmap(): Promise<Array<RoadmapMilestone>>;
    getScheduledSignals(sessionToken: string): Promise<Result_9>;
    getSessionRatings(sessionToken: string): Promise<Result_12>;
    getSessionRecap(history: Array<ChatMessage>, sessionToken: string): Promise<Result>;
    getSignalArchive(): Promise<Array<Signal>>;
    getSignalOfTheDay(): Promise<Signal | null>;
    getSignalOfWeek(): Promise<SignalOfWeekFull | null>;
    getSignalPerformanceStats(sessionToken: string): Promise<Result_11>;
    getSignals(): Promise<Array<Signal>>;
    getStats(): Promise<Stats>;
    getStatsConfig(sessionToken: string): Promise<Result_10>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getWhitepaper(): Promise<WhitepaperContent>;
    importSignals(sessionToken: string, inputs: Array<SignalInput>): Promise<Result_9>;
    initFaqs(): Promise<void>;
    invalidateAiSession(token: string): Promise<void>;
    invalidateSession(token: string): Promise<void>;
    listAuditSnapshots(sessionToken: string): Promise<Result_8>;
    markMilestoneReached(id: string, celebrateDays: bigint, sessionToken: string): Promise<Result_2>;
    publishScheduledSignals(): Promise<bigint>;
    rateAiResponse(messageId: string, rating: bigint, sessionToken: string): Promise<Result_2>;
    recordAbImpression(testId: string, variant: string): Promise<void>;
    recordAdminActivity(action: string, sessionToken: string): Promise<Result_2>;
    refreshMarketPrices(): Promise<Array<PriceData>>;
    reorderFaqs(sessionToken: string, orderedIds: Array<string>): Promise<Result_2>;
    scheduleSignal(signalId: string, publishAt: bigint, sessionToken: string): Promise<Result_2>;
    sendAiMessage(sessionToken: string, message: string, provider: string, mode: string, history: Array<ChatMessage>): Promise<Result>;
    setAiApiKey(adminToken: string, provider: string, key: string): Promise<Result_2>;
    setAiLanguage(lang: string, sessionToken: string): Promise<Result_2>;
    setAnnouncement(sessionToken: string, text: string, link: string | null, publishAt: bigint | null): Promise<Result_7>;
    setBurnTracker(adminToken: string, data: BurnTracker): Promise<Result_2>;
    setCommunityCounter(adminToken: string, data: CommunityCounter): Promise<Result_2>;
    setMaintenanceMode(enabled: boolean, message: string, sessionToken: string): Promise<Result_2>;
    setMarketMoodBanner(mood: string, message: string, sessionToken: string): Promise<Result_2>;
    setRoadmapMilestone(adminToken: string, year: string, title: string, description: string, completed: boolean): Promise<Result_2>;
    setSignalOfTheDay(sessionToken: string, signalId: string | null): Promise<Result_2>;
    setSignalOfWeek(signalId: string, comment: string, sessionToken: string): Promise<Result_2>;
    setSignalOfWeekWithDate(signalId: string, comment: string, weekOf: string, sessionToken: string): Promise<Result_2>;
    setStatsConfig(sessionToken: string, config: StatsConfig): Promise<Result_2>;
    submitNotifyMe(name: string | null, contact: string): Promise<Result_2>;
    toggleAnnouncement(sessionToken: string): Promise<Result_6>;
    unbanEmail(sessionToken: string, email: string): Promise<Result_2>;
    updateBinancePost(adminToken: string, id: string, title: string, snippet: string, url: string, date: string): Promise<Result_5>;
    updateBurnEntryStatus(id: string, status: string, txHash: string | null, sessionToken: string): Promise<Result_2>;
    updateFaq(sessionToken: string, id: string, question: string, answer: string): Promise<Result_4>;
    updateMarketSentiment(token: string, sentiment: MarketSentiment): Promise<Result_2>;
    updateSignal(sessionToken: string, id: string, asset: string, marketType: MarketType, direction: Direction, entryPrice: string, targetPrice: string, stopLoss: string, notes: string, confidence: Confidence, sourceLabel: string, expiry: bigint | null, timeframe: Timeframe, isDraft: boolean, publishAt: bigint | null): Promise<Result_3>;
    updateSignalResult(sessionToken: string, id: string, result: ResultStatus): Promise<Result_3>;
    updateSignalSchedule(sessionToken: string, id: string, isDraft: boolean, publishAt: bigint | null): Promise<Result_3>;
    updateWhitepaper(content: WhitepaperContent, sessionToken: string): Promise<Result_2>;
    validateAdminRole(passcode: string): Promise<string | null>;
    validateAiPasscode(passcode: string): Promise<Result_1>;
    validateAiSession(token: string): Promise<boolean>;
    validateInsaneSession(token: string): Promise<boolean>;
    validatePasscode(passcode: string): Promise<Result>;
    validateSession(token: string): Promise<boolean>;
}
