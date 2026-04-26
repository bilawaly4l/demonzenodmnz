import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Signal } from "../types";

export function useSignalOfTheDay() {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<Signal | null>({
    queryKey: ["signalOfTheDay"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getSignalOfTheDay();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
  };
}
