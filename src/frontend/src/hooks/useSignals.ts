import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useVoteOnSignal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      direction,
    }: { id: string; direction: "up" | "down" }) => {
      if (!actor) throw new Error("No actor");
      return actor.voteOnSignal(id, direction);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["signals"] });
      qc.invalidateQueries({ queryKey: ["signalOfTheDay"] });
    },
  });
}
