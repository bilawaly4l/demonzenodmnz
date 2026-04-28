import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CommunityCounter,
  CommunityMilestone,
  CommunityQuestion,
  DemonZenoQuote,
  SignalOfWeekFull,
  Testimonial,
  TopTrader,
} from "../types";

// ─── Quotes ───────────────────────────────────────────────────────────────
export function useQuotes() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<DemonZenoQuote[]>({
    queryKey: ["communityQuotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuotes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Testimonials ─────────────────────────────────────────────────────────
export function useTestimonials() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Testimonial[]>({
    queryKey: ["communityTestimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Community Questions ──────────────────────────────────────────────────
export function useCommunityQuestions() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CommunityQuestion[]>({
    queryKey: ["communityQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommunityQuestions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Top Traders ──────────────────────────────────────────────────────────
export function useTopTraders() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TopTrader[]>({
    queryKey: ["topTraders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopTraders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Signal of the Week ───────────────────────────────────────────────────
export function useSignalOfWeek() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SignalOfWeekFull | null>({
    queryKey: ["signalOfWeek"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getSignalOfWeek();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Community Counter ────────────────────────────────────────────────────
export function useCommunityCounter() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CommunityCounter | null>({
    queryKey: ["communityCounter"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCommunityCounter();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

// ─── Community Milestones ─────────────────────────────────────────────────
export function useCommunityMilestones() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CommunityMilestone[]>({
    queryKey: ["communityMilestones"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMilestones();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Submit Community Question ────────────────────────────────────────────
export function useSubmitCommunityQuestion() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (question: string) => {
      if (!actor) throw new Error("No actor");
      return actor.submitCommunityQuestion(question);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communityQuestions"] });
    },
  });
}

// ─── Vote on Community Question ───────────────────────────────────────────
export function useVoteCommunityQuestion() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.voteCommunityQuestion(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communityQuestions"] });
    },
  });
}
