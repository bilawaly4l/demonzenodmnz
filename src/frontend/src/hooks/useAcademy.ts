import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TierDisabledEntry } from "../backend";
import type {
  AnnouncementBanner,
  Certificate,
  QuizAttemptStats,
  TierQuiz,
} from "../types";

export type { TierDisabledEntry };

export function useGetAcademyQuiz(tierId: string, seed: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TierQuiz | null>({
    queryKey: ["academyQuiz", tierId, seed.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAcademyQuiz(tierId, seed);
    },
    enabled: !!actor && !isFetching && !!tierId,
    staleTime: 0,
  });
}

export function useQuizAttemptStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<QuizAttemptStats[]>({
    queryKey: ["quizAttemptStats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizAttemptStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAnnouncementBanner() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AnnouncementBanner | null>({
    queryKey: ["announcementBanner"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnnouncementBanner();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useVerifyCertificate(certId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Certificate | null>({
    queryKey: ["verifyCertificate", certId],
    queryFn: async () => {
      if (!actor || !certId) return null;
      return actor.verifyCertificate(certId);
    },
    enabled: !!actor && !isFetching && !!certId,
    staleTime: 30_000,
  });
}

export function useCertificateByShareToken(shareToken: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Certificate | null>({
    queryKey: ["certByShareToken", shareToken],
    queryFn: async () => {
      if (!actor || !shareToken) return null;
      return actor.getCertificateByShareToken(shareToken);
    },
    enabled: !!actor && !isFetching && !!shareToken,
    staleTime: 60_000,
  });
}

export function useSearchCertificates(searchTerm: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Certificate[]>({
    queryKey: ["searchCertificates", searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchCertificates(searchTerm);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useListAllCertificates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Certificate[]>({
    queryKey: ["listAllCertificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllCertificates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useFeaturedCertificates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Certificate[]>({
    queryKey: ["featuredCertificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedCertificates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetCertificatesByTier(tierId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Certificate[]>({
    queryKey: ["certsByTier", tierId],
    queryFn: async () => {
      if (!actor || !tierId) return [];
      return actor.getCertificatesByTier(tierId);
    },
    enabled: !!actor && !isFetching && !!tierId,
    staleTime: 15_000,
  });
}

export function useTierDisabledStates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TierDisabledEntry[]>({
    queryKey: ["tierDisabledStates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTierDisabledStates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSubmitQuiz() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      tierId: string;
      answers: Array<{ questionId: string; selectedOption: string }>;
      fullName: string;
      fathersName: string;
      country: string;
      dateOfBirth: string;
      email: string;
      city: string;
      seed: bigint;
      fingerprint: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.submitQuizAndIssueCertificate(
        params.tierId,
        params.answers,
        params.fullName,
        params.fathersName,
        params.country,
        params.dateOfBirth,
        params.email,
        params.city,
        params.seed,
        params.fingerprint,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["listAllCertificates"] });
      void qc.invalidateQueries({ queryKey: ["featuredCertificates"] });
    },
  });
}
