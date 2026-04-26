import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { CommunityCounter } from "../types";

const SEED_COUNTER: CommunityCounter = {
  lastUpdated: BigInt(0),
  binanceCount: BigInt(125_400),
  twitterCount: BigInt(89_200),
};

export function useCommunityCounter() {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<CommunityCounter>({
    queryKey: ["communityCounter"],
    queryFn: async () => {
      if (!actor) return SEED_COUNTER;
      const result = await actor.getCommunityCounter();
      // If backend returns zeros (fresh deploy), use seed values
      if (
        Number(result.binanceCount) === 0 &&
        Number(result.twitterCount) === 0
      ) {
        return SEED_COUNTER;
      }
      return result;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 120_000,
    placeholderData: SEED_COUNTER,
  });

  return {
    data: query.data ?? SEED_COUNTER,
    isLoading: query.isLoading,
    error: query.error ? "Failed to load community counter" : null,
    refetch: query.refetch,
  };
}
