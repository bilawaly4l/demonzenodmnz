import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Stats } from "../types";

export function useStats() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) {
        return {
          active: BigInt(0),
          wins: BigInt(0),
          losses: BigInt(0),
          winRate: 0,
          totalSignals: BigInt(0),
          assetsCovered: BigInt(0),
        };
      }
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}
