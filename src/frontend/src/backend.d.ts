import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
    ok: null;
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
export interface backendInterface {
    adminUpdateMilestone(id: string, completed: boolean): Promise<Result>;
    getRoadmap(): Promise<Array<RoadmapMilestone>>;
    getTokenInfo(): Promise<TokenInfo>;
}
