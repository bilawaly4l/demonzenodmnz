import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HypeMessage {
    message: string;
    timestamp: Timestamp;
    handle: string;
}
export interface RoadmapMilestone {
    id: string;
    title: string;
    date?: string;
    completed: boolean;
    year: string;
    description: string;
}
export type Result = {
    __kind__: "ok";
    ok: InterestEntry;
} | {
    __kind__: "err";
    err: string;
};
export type Timestamp = bigint;
export type Result_3 = {
    __kind__: "ok";
    ok: EarlyBeliever;
} | {
    __kind__: "err";
    err: string;
};
export type Result_2 = {
    __kind__: "ok";
    ok: First100Entry;
} | {
    __kind__: "err";
    err: string;
};
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
export interface CommunitySubmission {
    id: bigint;
    submitterHandle: string;
    description: string;
    timestamp: Timestamp;
}
export interface CommunityStats {
    earlyBelieverCount: bigint;
    pledgeCount: bigint;
    hypeCount: bigint;
    interestCount: bigint;
    first100Count: bigint;
    submissionCount: bigint;
}
export interface InterestEntry {
    timestamp: Timestamp;
    handle: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: HypeMessage;
} | {
    __kind__: "err";
    err: string;
};
export interface First100Entry {
    isOG: boolean;
    timestamp: Timestamp;
    handle: string;
    position: bigint;
}
export interface EarlyBeliever {
    timestamp: Timestamp;
    handle: string;
    index: bigint;
}
export interface backendInterface {
    getCommunityPosts(): Promise<Array<CommunitySubmission>>;
    getCommunityStats(): Promise<CommunityStats>;
    getEarlyBelievers(): Promise<Array<EarlyBeliever>>;
    getFirst100(): Promise<Array<First100Entry>>;
    getHypeMessages(): Promise<Array<HypeMessage>>;
    getInterestSubmissions(): Promise<Array<InterestEntry>>;
    getPledgeCount(): Promise<bigint>;
    getRoadmap(): Promise<Array<RoadmapMilestone>>;
    getTokenInfo(): Promise<TokenInfo>;
    submitCommunityPost(description: string, handle: string): Promise<boolean>;
    submitEarlyBeliever(handle: string): Promise<Result_3>;
    submitFirst100(handle: string): Promise<Result_2>;
    submitHypeMessage(handle: string, message: string): Promise<Result_1>;
    submitInterest(handle: string): Promise<Result>;
    submitPledge(name: string): Promise<bigint>;
}
