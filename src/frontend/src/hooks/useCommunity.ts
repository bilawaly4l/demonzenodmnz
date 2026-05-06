import { createActor } from "@/backend";
import type {
  CommunityStats,
  EarlyBeliever,
  First100Entry,
  HypeMessage,
  InterestEntry,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type {
  CommunityStats,
  EarlyBeliever,
  First100Entry,
  HypeMessage,
  InterestEntry,
};

export function useCommunityStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CommunityStats>({
    queryKey: ["communityStats"],
    queryFn: async () => {
      if (!actor)
        return {
          earlyBelieverCount: BigInt(0),
          pledgeCount: BigInt(0),
          hypeCount: BigInt(0),
          interestCount: BigInt(0),
          first100Count: BigInt(0),
          submissionCount: BigInt(0),
        };
      return actor.getCommunityStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useEarlyBelievers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<EarlyBeliever[]>({
    queryKey: ["earlyBelievers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEarlyBelievers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useHypeMessages() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<HypeMessage[]>({
    queryKey: ["hypeMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHypeMessages();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useFirst100() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<First100Entry[]>({
    queryKey: ["first100"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFirst100();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSubmitEarlyBeliever() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (handle: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitEarlyBeliever(handle);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["earlyBelievers"] });
      qc.invalidateQueries({ queryKey: ["communityStats"] });
    },
  });
}

export function useSubmitHypeMessage() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      handle,
      message,
    }: { handle: string; message: string }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitHypeMessage(handle, message);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hypeMessages"] });
      qc.invalidateQueries({ queryKey: ["communityStats"] });
    },
  });
}

export function useSubmitFirst100() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (handle: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitFirst100(handle);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["first100"] });
      qc.invalidateQueries({ queryKey: ["communityStats"] });
    },
  });
}

export function useSubmitInterest() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (handle: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.submitInterest(handle);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communityStats"] });
    },
  });
}

export function useInterestSubmissions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InterestEntry[]>({
    queryKey: ["interestSubmissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInterestSubmissions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
