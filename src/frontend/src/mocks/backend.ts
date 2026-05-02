import { 
  ABTestRecord,
  DailyActiveLog,
  LessonEngagement,
  LessonOfWeek,
  MasteryRecord,
  MonthlyChallenge,
  ProgressSnapshot,
  TransformationInput,
  TransformationOutput,
 } from "../backend";
import type { 
  AdminStats,
  AnnouncementBanner,
  Certificate,
  CertificateInfo,
  QuizAnswer,
  QuizAttemptStats,
  QuizQuestion,
  Result,
  Result_1,
  RoadmapMilestone,
  TierQuiz,
  TokenInfo,
  ZenoAiResponse,
  backendInterface,
 } from "../backend";

// ─── Mock certificate data ────────────────────────────────────────────────────

const MOCK_CERT_INFO: CertificateInfo = {
  fullName: "Bilal Ahmed",
  fathersName: "Ahmed Khan",
  country: "Pakistan",
  dateOfBirth: "1998-04-02",
  email: "bilal@example.com",
  city: "Lahore",
};

const MOCK_CERTIFICATES: Certificate[] = [
  {
    certId: "A7K2X9P1Q",
    certInfo: { ...MOCK_CERT_INFO, fullName: "Bilal Ahmed" },
    tierId: "beginner",
    tierName: "Beginner",
    score: BigInt(30),
    totalQuestions: BigInt(30),
    issuedAt: BigInt(Date.now() * 1_000_000),
    isValid: true,
    featured: false,
    shareToken: "share_A7K2X9P1Q",
  },
  {
    certId: "B3M5Z8W2R",
    certInfo: { ...MOCK_CERT_INFO, fullName: "Zara Hassan", country: "UAE" },
    tierId: "intermediate",
    tierName: "Intermediate",
    score: BigInt(30),
    totalQuestions: BigInt(30),
    issuedAt: BigInt((Date.now() - 86400000) * 1_000_000),
    isValid: true,
    featured: false,
    shareToken: "share_B3M5Z8W2R",
  },
  {
    certId: "C9N4Y7U6T",
    certInfo: {
      ...MOCK_CERT_INFO,
      fullName: "Omar Siddiqui",
      country: "Saudi Arabia",
    },
    tierId: "advanced",
    tierName: "Advanced",
    score: BigInt(30),
    totalQuestions: BigInt(30),
    issuedAt: BigInt((Date.now() - 172800000) * 1_000_000),
    isValid: true,
    featured: true,
    shareToken: "share_C9N4Y7U6T",
  },
];

const MOCK_ROADMAP: RoadmapMilestone[] = [
  {
    id: "2026",
    year: "2026",
    title: "Community Building Year",
    description:
      "Build DemonZeno's presence and community of traders across Binance Square and Twitter.",
    completed: true,
  },
  {
    id: "2027",
    year: "2027",
    date: "April 2, 2027",
    title: "DMNZ Token Launch on Blum",
    description:
      "Fair launch of DMNZ token via Telegram Mini App on Blum. 100% community owned.",
    completed: false,
  },
  {
    id: "2028",
    year: "2028",
    date: "January 1, 2028",
    title: "Buyback & Burn Program",
    description:
      "Massive buyback and burn to reduce DMNZ supply, increase value, and trigger bonding curve.",
    completed: false,
  },
];

const MOCK_TOKEN_INFO: TokenInfo = {
  name: "DemonZeno",
  ticker: "DMNZ",
  description:
    "DemonZeno (DMNZ) is a meme token built for the trading community. Fair launch, no presale, no insiders. 100% community owned.",
  launchPlatform: "Blum Mini App",
  slogan: "Trade Like a God. Hold Like a Demon.",
  totalSupply: "1,000,000,000 DMNZ",
  distribution: "100% fair launch — no presale, no allocation",
  socialLinks: [
    {
      name: "Binance Square",
      url: "https://www.binance.com/en/square/profile/@DemonZeno",
    },
    { name: "Twitter", url: "https://twitter.com/ZenoDemon" },
  ],
};

const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question:
      "A trader sees price break above a key resistance with high volume. What should they consider?",
    options: [
      {
        id: "a",
        text: "This may be a breakout — watch for confirmation before entering",
      },
      { id: "b", text: "Immediately sell, high volume is bearish" },
      { id: "c", text: "Ignore volume and trade based on news only" },
      { id: "d", text: "Wait 3 days before any decision" },
    ],
    correctOption: "a",
    explanation:
      "High volume breakouts above resistance are potential bullish setups but confirmation (like a retest) strengthens the signal.",
    isReviewFlagged: false,
  },
];

function generateCertId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 9 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

// ─── Mock backend implementation ──────────────────────────────────────────────

export const mockBackend: backendInterface = {
  async adminExportCertificates(): Promise<Certificate[]> {
    return MOCK_CERTIFICATES;
  },

  async adminFeatureCertificate(_certId: string, _featured: boolean): Promise<Result_1> {
    return { __kind__: "ok", ok: null };
  },

  async adminFlagQuestion(_questionId: string, _flagged: boolean): Promise<void> {
    return;
  },

  async adminGetAttemptLogs(_tierId: string) {
    return [];
  },

  async adminGetFlaggedQuestions() {
    return [];
  },

  async adminGetQuestionFailStats(_tierId: string) {
    return [];
  },

  async adminSetTierDisabled(_tierId: string, _disabled: boolean): Promise<Result_1> {
    return { __kind__: "ok", ok: null };
  },

  async getCertificateByShareToken(_shareToken: string): Promise<Certificate | null> {
    return null;
  },

  async getFeaturedCertificates(): Promise<Certificate[]> {
    return MOCK_CERTIFICATES.filter((c) => c.featured);
  },

  async getTierDisabledStates() {
    return [];
  },
  async adminGetStats(): Promise<AdminStats> {
    return {
      totalCertificates: BigInt(MOCK_CERTIFICATES.length),
      certsByTier: [
        ["beginner", BigInt(1)],
        ["intermediate", BigInt(1)],
        ["advanced", BigInt(1)],
      ],
    };
  },

  async adminManualIssueCertificate(
    tierId: string,
    info: CertificateInfo,
  ): Promise<Result> {
    const cert: Certificate = {
      certId: generateCertId(),
      certInfo: info,
      tierId,
      tierName: tierId.charAt(0).toUpperCase() + tierId.slice(1),
      score: BigInt(30),
      totalQuestions: BigInt(30),
      issuedAt: BigInt(Date.now() * 1_000_000),
      isValid: true,
      featured: false,
      shareToken: generateCertId(),
    };
    return { __kind__: "ok", ok: cert };
  },

  async adminRevokeOrReinstateCertificate(
    _certId: string,
    _isValid: boolean,
  ): Promise<Result_1> {
    return { __kind__: "ok", ok: null };
  },

  async adminSetAnnouncementBanner(
    _text: string,
    _isPinned: boolean,
  ): Promise<void> {
    return;
  },

  async adminUpdateMilestone(
    _id: string,
    _completed: boolean,
  ): Promise<Result_1> {
    return { __kind__: "ok", ok: null };
  },

  async askZenoAi(question: string): Promise<ZenoAiResponse> {
    return {
      success: true,
      answer: `Great question about "${question}". In trading, knowledge is your edge — keep learning and stay disciplined. — DemonZeno`,
    };
  },

  async getAcademyQuiz(
    tierId: string,
    _seed: bigint,
  ): Promise<TierQuiz | null> {
    return {
      tierId,
      tierName: tierId.charAt(0).toUpperCase() + tierId.slice(1),
      questions: MOCK_QUESTIONS,
    };
  },

  async getAnnouncementBanner(): Promise<AnnouncementBanner | null> {
    return null;
  },

  async getCertificatesByTier(tierId: string): Promise<Certificate[]> {
    return MOCK_CERTIFICATES.filter((c) => c.tierId === tierId);
  },

  async getQuizAttemptStats(): Promise<QuizAttemptStats[]> {
    return [
      { tierId: "beginner", totalAttempts: BigInt(42), passCount: BigInt(8) },
      {
        tierId: "intermediate",
        totalAttempts: BigInt(21),
        passCount: BigInt(3),
      },
      { tierId: "advanced", totalAttempts: BigInt(10), passCount: BigInt(1) },
    ];
  },

  async getRoadmap(): Promise<RoadmapMilestone[]> {
    return MOCK_ROADMAP;
  },

  async getTokenInfo(): Promise<TokenInfo> {
    return MOCK_TOKEN_INFO;
  },

  async listAllCertificates(): Promise<Certificate[]> {
    return MOCK_CERTIFICATES;
  },

  async searchCertificates(searchTerm: string): Promise<Certificate[]> {
    const q = searchTerm.toLowerCase();
    return MOCK_CERTIFICATES.filter(
      (c) =>
        c.certId.toLowerCase().includes(q) ||
        c.certInfo.fullName.toLowerCase().includes(q) ||
        c.certInfo.country.toLowerCase().includes(q) ||
        c.tierName.toLowerCase().includes(q),
    );
  },

  async submitQuizAndIssueCertificate(
    tierId: string,
    _answers: QuizAnswer[],
    fullName: string,
    fathersName: string,
    country: string,
    dateOfBirth: string,
    email: string,
    city: string,
    _seed: bigint,
    _fingerprint: string,
  ): Promise<Result> {
    const id = generateCertId();
    const cert: Certificate = {
      certId: id,
      certInfo: { fullName, fathersName, country, dateOfBirth, email, city },
      tierId,
      tierName: tierId.charAt(0).toUpperCase() + tierId.slice(1),
      score: BigInt(30),
      totalQuestions: BigInt(30),
      issuedAt: BigInt(Date.now() * 1_000_000),
      isValid: true,
      featured: false,
      shareToken: generateCertId(),
    };
    return { __kind__: "ok", ok: cert };
  },

  async verifyCertificate(certId: string): Promise<Certificate | null> {
    return MOCK_CERTIFICATES.find((c) => c.certId === certId) ?? null;
  },

  zenoAiTransform: async (input) => ({
    status: input.response.status,
    body: input.response.body,
    headers: input.response.headers,
  }),

  async getAdminLessonRatings() {
    return [];
  },

  async getDailyActiveCounts() {
    return [];
  },

  async getFeaturedLesson(_tierId: string): Promise<string | null> {
    return null;
  },

  async getLessonCompletionTrends() {
    return [];
  },

  async getLessonRatings(_tierId: string, _lessonId: string) {
    return [];
  },

  async getQuizFailMessage(_tierId: string): Promise<string | null> {
    return null;
  },

  async logDailyActive(_date: string): Promise<void> {
    return;
  },

  async logLessonCompletion(
    _tierId: string,
    _lessonId: string,
    _timestamp: bigint,
  ): Promise<void> {
    return;
  },

  async setFeaturedLesson(
    _tierId: string,
    _lessonId: string,
    _passcode: string,
  ): Promise<boolean> {
    return true;
  },

  async setQuizFailMessage(
    _tierId: string,
    _message: string,
    _passcode: string,
  ): Promise<boolean> {
    return true;
  },

  async submitCheckpointQuiz(
    _tierId: string,
    _score: bigint,
  ): Promise<boolean> {
    return true;
  },

  async submitLessonRating(
    _tierId: string,
    _lessonId: string,
    _rating: bigint,
  ): Promise<boolean> {
    return true;
  },

  // ─── Learning Science APIs ─────────────────────────────────────────────────

  async updateLessonMastery(
    _lessonId: string,
    _tier: string,
    _confidenceScore: number,
    _conceptCheckerScore: number,
    _quizScore: number,
  ): Promise<void> {
    return;
  },

  async getLessonMastery(_lessonId: string): Promise<MasteryRecord | null> {
    return null;
  },

  async getAllMasteryRecords(): Promise<MasteryRecord[]> {
    return [];
  },

  async recordLessonCompleted(_lessonId: string): Promise<MonthlyChallenge> {
    const month = new Date().toISOString().slice(0, 7);
    return {
      month,
      lessonsCompleted: BigInt(1),
      targetLessons: BigInt(10),
      badgeEarned: false,
    };
  },

  async getMonthlyChallenge(_month: string): Promise<MonthlyChallenge | null> {
    return null;
  },

  async generateProgressShareLink(
    _tiersCompleted: string[],
    _certificatesEarned: string[],
    _masteryLevels: [string, number][],
  ): Promise<string> {
    return `mock_share_${generateCertId()}`;
  },

  async getProgressSnapshot(_shareToken: string): Promise<ProgressSnapshot | null> {
    return null;
  },

  async recordLessonTime(
    _lessonId: string,
    _tier: string,
    _timeSeconds: bigint,
  ): Promise<void> {
    return;
  },

  async getLessonOfWeek(): Promise<LessonOfWeek | null> {
    return null;
  },

  // ─── Admin A/B & Analytics APIs ───────────────────────────────────────────

  async adminCreateABTest(
    _passcode: string,
    _questionId: string,
    _versionAText: string,
    _versionBText: string,
  ): Promise<void> {
    return;
  },

  async adminGetABTests(_passcode: string): Promise<ABTestRecord[]> {
    return [];
  },

  async adminToggleABVersion(
    _passcode: string,
    _questionId: string,
  ): Promise<void> {
    return;
  },

  async recordABTestResult(
    _questionId: string,
    _version: string,
    _passed: boolean,
  ): Promise<void> {
    return;
  },

  async adminGetEngagementData(_passcode: string): Promise<LessonEngagement[]> {
    return [];
  },

  async adminGetMonthlyStats(_passcode: string): Promise<[string, bigint][]> {
    return [];
  },

  async adminSetLessonOfWeek(
    _passcode: string,
    _lessonId: string,
    _lessonTitle: string,
    _tier: string,
  ): Promise<void> {
    return;
  },
};
