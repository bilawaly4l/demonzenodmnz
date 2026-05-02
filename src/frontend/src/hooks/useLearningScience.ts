import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LessonOfWeek,
  MasteryRecord,
  MonthlyChallenge,
  ProgressSnapshot,
} from "../backend";

export type { LessonOfWeek, MasteryRecord, MonthlyChallenge, ProgressSnapshot };

// ─── LocalStorage helpers ────────────────────────────────────────────────────

const LS_MASTERY_PREFIX = "dz_mastery_";

function lsSaveMastery(record: MasteryRecord): void {
  try {
    localStorage.setItem(
      `${LS_MASTERY_PREFIX}${record.lessonId}`,
      JSON.stringify(record),
    );
  } catch {
    /* storage full – silently ignore */
  }
}

function lsGetMastery(lessonId: string): MasteryRecord | null {
  try {
    const raw = localStorage.getItem(`${LS_MASTERY_PREFIX}${lessonId}`);
    return raw ? (JSON.parse(raw) as MasteryRecord) : null;
  } catch {
    return null;
  }
}

function lsGetAllMastery(): MasteryRecord[] {
  const results: MasteryRecord[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(LS_MASTERY_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) results.push(JSON.parse(raw) as MasteryRecord);
      }
    }
  } catch {
    /* ignore */
  }
  return results;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Fetch mastery record for a single lesson. Falls back to localStorage. */
export function useMasteryScore(lessonId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MasteryRecord | null>({
    queryKey: ["lessonMastery", lessonId],
    queryFn: async () => {
      if (!actor) return lsGetMastery(lessonId);
      try {
        const record = await actor.getLessonMastery(lessonId);
        if (record) lsSaveMastery(record);
        return record ?? lsGetMastery(lessonId);
      } catch {
        return lsGetMastery(lessonId);
      }
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

/** Fetch all mastery records for the current user. Falls back to localStorage. */
export function useAllMasteryRecords() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MasteryRecord[]>({
    queryKey: ["allMasteryRecords"],
    queryFn: async () => {
      if (!actor) return lsGetAllMastery();
      try {
        const records = await actor.getAllMasteryRecords();
        records.forEach(lsSaveMastery);
        return records.length > 0 ? records : lsGetAllMastery();
      } catch {
        return lsGetAllMastery();
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

/** Update / create a mastery record for a lesson. */
export function useRecordLessonMastery() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      lessonId: string;
      tier: string;
      confidenceScore: number;
      conceptCheckerScore: number;
      quizScore: number;
    }) => {
      const optimistic: MasteryRecord = {
        lessonId: params.lessonId,
        tier: params.tier,
        confidenceScore: params.confidenceScore,
        conceptCheckerScore: params.conceptCheckerScore,
        quizScore: params.quizScore,
        masteryPct:
          (params.confidenceScore * 20 +
            params.conceptCheckerScore * 40 +
            params.quizScore * 40) /
          100,
        updatedAt: BigInt(Date.now()),
      };
      lsSaveMastery(optimistic);
      if (actor) {
        await actor.updateLessonMastery(
          params.lessonId,
          params.tier,
          params.confidenceScore,
          params.conceptCheckerScore,
          params.quizScore,
        );
      }
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["lessonMastery", variables.lessonId] });
      qc.invalidateQueries({ queryKey: ["allMasteryRecords"] });
    },
  });
}

/** Record a lesson completion and get updated monthly challenge status. */
export function useRecordLessonCompleted() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string): Promise<MonthlyChallenge | null> => {
      if (!actor) return null;
      return actor.recordLessonCompleted(lessonId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["monthlyChallenge"] });
    },
  });
}

/** Get the monthly challenge for a given month string (e.g. "2026-05"). */
export function useMonthlyChallenge(month: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MonthlyChallenge | null>({
    queryKey: ["monthlyChallenge", month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthlyChallenge(month);
    },
    enabled: !!actor && !isFetching && !!month,
    staleTime: 60_000,
  });
}

/** Generate a shareable progress link. */
export function useGenerateShareLink() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      tiersCompleted: string[];
      certificatesEarned: string[];
      masteryLevels: [string, number][];
    }): Promise<string> => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateProgressShareLink(
        params.tiersCompleted,
        params.certificatesEarned,
        params.masteryLevels,
      );
    },
  });
}

/** Fetch a progress snapshot by share token. */
export function useProgressSnapshot(shareToken: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ProgressSnapshot | null>({
    queryKey: ["progressSnapshot", shareToken],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProgressSnapshot(shareToken);
    },
    enabled: !!actor && !isFetching && !!shareToken,
    staleTime: 5 * 60_000,
  });
}

/** Record time spent on a lesson. */
export function useRecordLessonTime() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      lessonId: string;
      tier: string;
      timeSeconds: number;
    }) => {
      if (!actor) return;
      await actor.recordLessonTime(
        params.lessonId,
        params.tier,
        BigInt(Math.round(params.timeSeconds)),
      );
    },
  });
}

/** Get the current lesson of the week. */
export function useLessonOfWeek() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LessonOfWeek | null>({
    queryKey: ["lessonOfWeek"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLessonOfWeek();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60_000,
  });
}
