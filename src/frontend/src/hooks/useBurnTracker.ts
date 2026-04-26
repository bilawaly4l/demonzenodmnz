import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BurnTracker } from "../types";

export function useBurnTracker() {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<BurnTracker>({
    queryKey: ["burnTracker"],
    queryFn: async () => {
      if (!actor) return { lastUpdated: BigInt(0), totalBurned: BigInt(0) };
      return actor.getBurnTracker();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? "Failed to load burn tracker" : null,
    refetch: query.refetch,
  };
}
