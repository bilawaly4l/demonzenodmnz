import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuizAttemptLog {
    tierId: string;
    score: bigint;
    fingerprint: string;
    timestamp: bigint;
    passed: boolean;
}
export interface QuizAnswer {
    questionId: string;
    selectedOption: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ZenoAiResponse {
    answer: string;
    success: boolean;
}
export interface QuizQuestion {
    id: string;
    correctOption: string;
    question: string;
    explanation: string;
    isReviewFlagged: boolean;
    options: Array<QuizOption>;
}
export interface QuestionFailStat {
    tierId: string;
    totalSeen: bigint;
    questionId: string;
    failCount: bigint;
}
export interface DailyActiveLog {
    date: string;
    count: bigint;
}
export interface ABTestRecord {
    versionAPassCount: bigint;
    activeVersion: string;
    versionBText: string;
    versionBAttempts: bigint;
    versionAText: string;
    questionId: string;
    versionAAttempts: bigint;
    versionBPassCount: bigint;
}
export interface TierQuiz {
    tierId: TierId;
    tierName: string;
    questions: Array<QuizQuestion>;
}
export type Result_1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface TierDisabledEntry {
    tierId: string;
    disabled: boolean;
}
export interface ProgressSnapshot {
    createdAt: bigint;
    shareToken: string;
    tiersCompleted: Array<string>;
    masteryLevels: Array<[string, number]>;
    certificatesEarned: Array<string>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface QuizAttemptStats {
    tierId: string;
    passCount: bigint;
    totalAttempts: bigint;
}
export interface CertificateInfo {
    country: string;
    dateOfBirth: string;
    city: string;
    fullName: string;
    fathersName: string;
    email: string;
}
export interface QuizOption {
    id: string;
    text: string;
}
export interface LessonEngagement {
    lessonId: string;
    visitCount: bigint;
    tier: string;
    totalTimeSeconds: bigint;
}
export interface LessonOfWeek {
    lessonId: string;
    expiresAt: bigint;
    tier: string;
    lessonTitle: string;
    setAt: bigint;
}
export interface MasteryRecord {
    lessonId: string;
    quizScore: number;
    tier: string;
    confidenceScore: number;
    updatedAt: bigint;
    masteryPct: number;
    conceptCheckerScore: number;
}
export type TierId = string;
export interface RoadmapMilestone {
    id: string;
    title: string;
    date?: string;
    completed: boolean;
    year: string;
    description: string;
}
export interface TokenInfo {
    ticker: string;
    socialLinks: Array<{
        url: string;
        name: string;
    }>;
    name: string;
    launchPlatform: string;
    description: string;
    totalSupply: string;
    slogan: string;
    distribution: string;
}
export interface AnnouncementBanner {
    text: string;
    updatedAt: bigint;
    isPinned: boolean;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Result = {
    __kind__: "ok";
    ok: Certificate;
} | {
    __kind__: "err";
    err: string;
};
export interface AdminStats {
    certsByTier: Array<[string, bigint]>;
    totalCertificates: bigint;
}
export interface LessonRating {
    lessonId: string;
    tierId: string;
    timestamp: bigint;
    rating: bigint;
}
export interface LessonCompletionLog {
    lessonId: string;
    completedAt: bigint;
    tierId: string;
}
export interface Certificate {
    certId: string;
    featured: boolean;
    certInfo: CertificateInfo;
    tierId: TierId;
    tierName: string;
    shareToken: string;
    score: bigint;
    totalQuestions: bigint;
    issuedAt: bigint;
    isValid: boolean;
}
export interface MonthlyChallenge {
    month: string;
    targetLessons: bigint;
    badgeEarned: boolean;
    lessonsCompleted: bigint;
}
export interface backendInterface {
    adminCreateABTest(passcode: string, questionId: string, versionAText: string, versionBText: string): Promise<void>;
    adminExportCertificates(): Promise<Array<Certificate>>;
    adminFeatureCertificate(certId: string, featured: boolean): Promise<Result_1>;
    adminFlagQuestion(questionId: string, flagged: boolean): Promise<void>;
    adminGetABTests(passcode: string): Promise<Array<ABTestRecord>>;
    adminGetAttemptLogs(tierId: string): Promise<Array<QuizAttemptLog>>;
    adminGetEngagementData(passcode: string): Promise<Array<LessonEngagement>>;
    adminGetFlaggedQuestions(): Promise<Array<string>>;
    adminGetMonthlyStats(passcode: string): Promise<Array<[string, bigint]>>;
    adminGetQuestionFailStats(tierId: string): Promise<Array<QuestionFailStat>>;
    adminGetStats(): Promise<AdminStats>;
    adminManualIssueCertificate(tierId: string, info: CertificateInfo): Promise<Result>;
    adminRevokeOrReinstateCertificate(certId: string, isValid: boolean): Promise<Result_1>;
    adminSetAnnouncementBanner(text: string, isPinned: boolean): Promise<void>;
    adminSetLessonOfWeek(passcode: string, lessonId: string, lessonTitle: string, tier: string): Promise<void>;
    adminSetTierDisabled(tierId: string, disabled: boolean): Promise<Result_1>;
    adminToggleABVersion(passcode: string, questionId: string): Promise<void>;
    adminUpdateMilestone(id: string, completed: boolean): Promise<Result_1>;
    askZenoAi(question: string): Promise<ZenoAiResponse>;
    generateProgressShareLink(tiersCompleted: Array<string>, certificatesEarned: Array<string>, masteryLevels: Array<[string, number]>): Promise<string>;
    getAcademyQuiz(tierId: string, seed: bigint): Promise<TierQuiz | null>;
    getAdminLessonRatings(): Promise<Array<[string, string, number]>>;
    getAllMasteryRecords(): Promise<Array<MasteryRecord>>;
    getAnnouncementBanner(): Promise<AnnouncementBanner | null>;
    getCertificateByShareToken(shareToken: string): Promise<Certificate | null>;
    getCertificatesByTier(tierId: string): Promise<Array<Certificate>>;
    getDailyActiveCounts(): Promise<Array<DailyActiveLog>>;
    getFeaturedCertificates(): Promise<Array<Certificate>>;
    getFeaturedLesson(tierId: string): Promise<string | null>;
    getLessonCompletionTrends(): Promise<Array<LessonCompletionLog>>;
    getLessonMastery(lessonId: string): Promise<MasteryRecord | null>;
    getLessonOfWeek(): Promise<LessonOfWeek | null>;
    getLessonRatings(tierId: string, lessonId: string): Promise<Array<LessonRating>>;
    getMonthlyChallenge(month: string): Promise<MonthlyChallenge | null>;
    getProgressSnapshot(shareToken: string): Promise<ProgressSnapshot | null>;
    getQuizAttemptStats(): Promise<Array<QuizAttemptStats>>;
    getQuizFailMessage(tierId: string): Promise<string | null>;
    getRoadmap(): Promise<Array<RoadmapMilestone>>;
    getTierDisabledStates(): Promise<Array<TierDisabledEntry>>;
    getTokenInfo(): Promise<TokenInfo>;
    listAllCertificates(): Promise<Array<Certificate>>;
    logDailyActive(date: string): Promise<void>;
    logLessonCompletion(tierId: string, lessonId: string, timestamp: bigint): Promise<void>;
    recordABTestResult(questionId: string, version: string, passed: boolean): Promise<void>;
    recordLessonCompleted(lessonId: string): Promise<MonthlyChallenge>;
    recordLessonTime(lessonId: string, tier: string, timeSeconds: bigint): Promise<void>;
    searchCertificates(searchTerm: string): Promise<Array<Certificate>>;
    setFeaturedLesson(tierId: string, lessonId: string, passcode: string): Promise<boolean>;
    setQuizFailMessage(tierId: string, message: string, passcode: string): Promise<boolean>;
    submitCheckpointQuiz(tierId: string, score: bigint): Promise<boolean>;
    submitLessonRating(tierId: string, lessonId: string, rating: bigint): Promise<boolean>;
    submitQuizAndIssueCertificate(tierId: string, answers: Array<QuizAnswer>, fullName: string, fathersName: string, country: string, dateOfBirth: string, email: string, city: string, seed: bigint, fingerprint: string): Promise<Result>;
    updateLessonMastery(lessonId: string, tier: string, confidenceScore: number, conceptCheckerScore: number, quizScore: number): Promise<void>;
    verifyCertificate(certId: string): Promise<Certificate | null>;
    zenoAiTransform(input: TransformationInput): Promise<TransformationOutput>;
}
