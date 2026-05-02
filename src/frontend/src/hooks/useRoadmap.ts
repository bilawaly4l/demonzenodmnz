import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { RoadmapMilestone, TokenInfo } from "../types";

export function useRoadmap() {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<RoadmapMilestone[]>({
    queryKey: ["roadmap"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoadmap();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  return {
    milestones: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? "Failed to load roadmap" : null,
  };
}

export function useGetTokenInfo() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TokenInfo | null>({
    queryKey: ["tokenInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTokenInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });
}
