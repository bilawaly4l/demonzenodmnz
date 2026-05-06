// Mock backend — stub for development builds only
// All dead academy/admin types removed; only current backend interface used
import type {
  CommunityStats,
  EarlyBeliever,
  First100Entry,
  HypeMessage,
  InterestEntry,
  Result,
  Result_2,
  Result_1,
  Result_3,
  RoadmapMilestone,
  TokenInfo,
  backendInterface,
} from "../backend";

const MOCK_MILESTONES: RoadmapMilestone[] = [
  {
    id: "2026-community",
    year: "2026",
    title: "Community Building Year",
    description: "Growing the DemonZeno community, spreading awareness, and building the foundation for DMNZ launch.",
    completed: false,
    date: "2026",
  },
  {
    id: "2027-launch",
    year: "2027",
    title: "DMNZ Launches on Blum",
    description: "April 2, 2027 — DMNZ token goes live on the Blum Mini App. Full fair launch, no presale.",
    completed: false,
    date: "April 2, 2027",
  },
  {
    id: "2028-burn",
    year: "2028",
    title: "Huge Buyback & Burn",
    description: "January 1, 2028 — Massive buyback and burn event to reduce circulating supply and hit the bonding curve.",
    completed: false,
    date: "January 1, 2028",
  },
];

const MOCK_TOKEN_INFO: TokenInfo = {
  name: "DemonZeno",
  ticker: "DMNZ",
  description: "A 100% fair launch meme token born from discipline and sacrifice. No presale, no team allocation — everyone enters at the same price.",
  slogan: "Trade Like a God. Hold Like a Demon.",
  totalSupply: "1,000,000,000 DMNZ",
  distribution: "100% Fair Launch — No presale, no team tokens, no allocation. Everyone buys at the same price.",
  launchPlatform: "Blum Mini App",
  socialLinks: [
    { name: "Binance Square", url: "https://www.binance.com/en/square/profile/@Demon_Zeno" },
    { name: "Twitter", url: "https://twitter.com/ZenoDemon" },
  ],
};

const makeOk = <T,>(ok: T): { __kind__: "ok"; ok: T } => ({ __kind__: "ok", ok });
const makeErr = (err: string): { __kind__: "err"; err: string } => ({ __kind__: "err", err });

export const mockBackend: backendInterface = {
  getRoadmap: async () => MOCK_MILESTONES,
  getTokenInfo: async () => MOCK_TOKEN_INFO,

  getCommunityStats: async (): Promise<CommunityStats> => ({
    earlyBelieverCount: BigInt(42),
    hypeCount: BigInt(17),
    first100Count: BigInt(8),
    interestCount: BigInt(93),
    pledgeCount: BigInt(24),
    submissionCount: BigInt(5),
  }),

  getEarlyBelievers: async (): Promise<EarlyBeliever[]> => [
    { handle: "@crypto_believer", timestamp: BigInt(Date.now()), index: BigInt(1) },
    { handle: "@moon_hunter", timestamp: BigInt(Date.now()), index: BigInt(2) },
    { handle: "@dmnz_fan", timestamp: BigInt(Date.now()), index: BigInt(3) },
  ],

  getHypeMessages: async (): Promise<HypeMessage[]> => [
    { handle: "@zeno_fan", message: "DMNZ is the next 100x. Fair launch, real community!", timestamp: BigInt(Date.now()) },
    { handle: "@believer99", message: "Following DemonZeno since day one. This is the real deal.", timestamp: BigInt(Date.now()) },
  ],

  getFirst100: async (): Promise<First100Entry[]> => [
    { handle: "@og_holder_1", timestamp: BigInt(Date.now()), position: BigInt(1), isOG: true },
    { handle: "@og_holder_2", timestamp: BigInt(Date.now()), position: BigInt(2), isOG: true },
  ],

  getInterestSubmissions: async (): Promise<InterestEntry[]> => [
    { handle: "@interested_1", timestamp: BigInt(Date.now()) },
    { handle: "@interested_2", timestamp: BigInt(Date.now()) },
  ],

  submitEarlyBeliever: async (handle: string): Promise<Result_3> =>
    makeOk({ handle, timestamp: BigInt(Date.now()), index: BigInt(99) }),

  submitHypeMessage: async (handle: string, message: string): Promise<Result_1> =>
    makeOk({ handle, message, timestamp: BigInt(Date.now()) }),

  submitFirst100: async (handle: string): Promise<Result_2> =>
    makeOk({ handle, timestamp: BigInt(Date.now()), position: BigInt(10), isOG: false }),

  submitInterest: async (handle: string): Promise<Result> =>
    makeOk({ handle, timestamp: BigInt(Date.now()) }),

  getPledgeCount: async (): Promise<bigint> => BigInt(24),

  submitPledge: async (_name: string): Promise<bigint> => BigInt(25),

  getCommunityPosts: async () => [
    { id: BigInt(1), submitterHandle: "@dmnz_fan", description: "DMNZ to the moon!", timestamp: BigInt(Date.now()) },
  ],

  submitCommunityPost: async (_description: string, _handle: string): Promise<boolean> => true,
};
