import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  BurnEvent,
  HolderBenefit,
  HypeMilestone,
  TokenData,
} from "../types";

// ─── Token Data ───────────────────────────────────────────────────────────
export function useTokenData() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TokenData | null>({
    queryKey: ["tokenData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTokenData();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });
}

// ─── Hype Milestones ──────────────────────────────────────────────────────
export function useHypeMilestones() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<HypeMilestone[]>({
    queryKey: ["hypeMilestones"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHypeMilestones();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Token Burn Schedule (for public token-launch section) ────────────────
export function useTokenBurnSchedule() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BurnEvent[]>({
    queryKey: ["tokenBurnSchedule"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTokenBurnSchedule();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });
}

// ─── Whitepaper URL ───────────────────────────────────────────────────────
export function useWhitepaperUrl() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string | null>({
    queryKey: ["whitepaperUrl"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWhitepaperUrl();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

// ─── Holder Benefits ──────────────────────────────────────────────────────
export function useHolderBenefits() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<HolderBenefit[]>({
    queryKey: ["holderBenefits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHolderBenefits();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });
}
