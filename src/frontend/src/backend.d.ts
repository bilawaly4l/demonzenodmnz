import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type TierId = string;
export interface RoadmapMilestone {
    id: string;
    title: string;
    date?: string;
    completed: boolean;
    year: string;
    description: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface QuizAnswer {
    questionId: string;
    selectedOption: string;
}
export interface ZenoAiResponse {
    answer: string;
    success: boolean;
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
export interface AnnouncementBanner {
    text: string;
    updatedAt: bigint;
    isPinned: boolean;
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
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TierDisabledEntry {
    tierId: string;
    disabled: boolean;
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
export interface QuizAttemptLog {
    tierId: string;
    score: bigint;
    fingerprint: string;
    timestamp: bigint;
    passed: boolean;
}
export interface backendInterface {
    adminExportCertificates(): Promise<Array<Certificate>>;
    adminFeatureCertificate(certId: string, featured: boolean): Promise<Result_1>;
    adminFlagQuestion(questionId: string, flagged: boolean): Promise<void>;
    adminGetAttemptLogs(tierId: string): Promise<Array<QuizAttemptLog>>;
    adminGetFlaggedQuestions(): Promise<Array<string>>;
    adminGetQuestionFailStats(tierId: string): Promise<Array<QuestionFailStat>>;
    adminGetStats(): Promise<AdminStats>;
    adminManualIssueCertificate(tierId: string, info: CertificateInfo): Promise<Result>;
    adminRevokeOrReinstateCertificate(certId: string, isValid: boolean): Promise<Result_1>;
    adminSetAnnouncementBanner(text: string, isPinned: boolean): Promise<void>;
    adminSetTierDisabled(tierId: string, disabled: boolean): Promise<Result_1>;
    adminUpdateMilestone(id: string, completed: boolean): Promise<Result_1>;
    askZenoAi(question: string): Promise<ZenoAiResponse>;
    getAcademyQuiz(tierId: string, seed: bigint): Promise<TierQuiz | null>;
    getAdminLessonRatings(): Promise<Array<[string, string, number]>>;
    getAnnouncementBanner(): Promise<AnnouncementBanner | null>;
    getCertificateByShareToken(shareToken: string): Promise<Certificate | null>;
    getCertificatesByTier(tierId: string): Promise<Array<Certificate>>;
    getDailyActiveCounts(): Promise<Array<DailyActiveLog>>;
    getFeaturedCertificates(): Promise<Array<Certificate>>;
    getFeaturedLesson(tierId: string): Promise<string | null>;
    getLessonCompletionTrends(): Promise<Array<LessonCompletionLog>>;
    getLessonRatings(tierId: string, lessonId: string): Promise<Array<LessonRating>>;
    getQuizAttemptStats(): Promise<Array<QuizAttemptStats>>;
    getQuizFailMessage(tierId: string): Promise<string | null>;
    getRoadmap(): Promise<Array<RoadmapMilestone>>;
    getTierDisabledStates(): Promise<Array<TierDisabledEntry>>;
    getTokenInfo(): Promise<TokenInfo>;
    listAllCertificates(): Promise<Array<Certificate>>;
    logDailyActive(date: string): Promise<void>;
    logLessonCompletion(tierId: string, lessonId: string, timestamp: bigint): Promise<void>;
    searchCertificates(searchTerm: string): Promise<Array<Certificate>>;
    setFeaturedLesson(tierId: string, lessonId: string, passcode: string): Promise<boolean>;
    setQuizFailMessage(tierId: string, message: string, passcode: string): Promise<boolean>;
    submitCheckpointQuiz(tierId: string, score: bigint): Promise<boolean>;
    submitLessonRating(tierId: string, lessonId: string, rating: bigint): Promise<boolean>;
    submitQuizAndIssueCertificate(tierId: string, answers: Array<QuizAnswer>, fullName: string, fathersName: string, country: string, dateOfBirth: string, email: string, city: string, seed: bigint, fingerprint: string): Promise<Result>;
    verifyCertificate(certId: string): Promise<Certificate | null>;
    zenoAiTransform(input: TransformationInput): Promise<TransformationOutput>;
}
