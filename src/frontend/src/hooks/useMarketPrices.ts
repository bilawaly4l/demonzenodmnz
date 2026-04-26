import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { PriceData } from "../types";

export function useMarketPrices() {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<PriceData[]>({
    queryKey: ["marketPrices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarketPrices();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  return {
    prices: query.data ?? [],
    isLoading: query.isLoading,
    lastUpdated: query.dataUpdatedAt ?? null,
  };
}
