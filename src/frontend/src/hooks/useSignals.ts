import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Signal } from "../types";

export function useSignals() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Signal[]>({
    queryKey: ["signals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSignals();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}
