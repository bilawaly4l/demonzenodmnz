import { createActor } from "@/backend";
import type { AdminActivityEntry, Backend } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Re-export the canonical type — AdminDashboard uses RawAdminLogEntry
export type RawAdminLogEntry = AdminActivityEntry;

// Extended backend for methods not yet in the main binding
interface ExtendedDripBackend extends Backend {
  clearAdminLog(): Promise<void>;
  getLessonGoLiveDates(tierId: bigint): Promise<Array<[bigint, bigint]>>;
}

function asExt(actor: Backend): ExtendedDripBackend {
  return actor as unknown as ExtendedDripBackend;
}

// ─── Admin Activity Log ───────────────────────────────────────────────────────

export function useGetAdminActivityLog(limit = 100) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AdminActivityEntry[]>({
    queryKey: ["adminActivityLog", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminActivityLog(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useClearAdminLog() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await asExt(actor).clearAdminLog();
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminActivityLog"] });
    },
  });
}

// ─── Drip scheduling ─────────────────────────────────────────────────────────

export function useGetLessonGoLiveDates(tierId: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Array<[bigint, bigint]>>({
    queryKey: ["lessonGoLiveDates", tierId],
    queryFn: async () => {
      if (!actor) return [];
      return asExt(actor).getLessonGoLiveDates(BigInt(tierId));
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSetLessonGoLiveDate() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      tierId: number;
      lessonId: number;
      goLiveDate: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.setLessonGoLiveDate(
        BigInt(vars.tierId),
        BigInt(vars.lessonId),
        BigInt(vars.goLiveDate),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["lessonGoLiveDates", vars.tierId],
      });
    },
  });
}

export function useRemoveLessonGoLiveDate() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { tierId: number; lessonId: number }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.removeLessonGoLiveDate(
        BigInt(vars.tierId),
        BigInt(vars.lessonId),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["lessonGoLiveDates", vars.tierId],
      });
    },
  });
}
