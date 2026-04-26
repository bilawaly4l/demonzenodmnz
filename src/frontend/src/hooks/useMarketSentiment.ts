import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { MarketSentiment } from "../types";

export function useMarketSentiment() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<MarketSentiment | undefined>({
    queryKey: ["marketSentiment"],
    queryFn: async () => {
      if (!actor) return undefined;
      return actor.getMarketSentiment();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
