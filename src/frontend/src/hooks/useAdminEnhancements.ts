import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createActor } from "../backend";
import type {
  AbTest,
  ActivityEntry,
  AuditSnapshot,
  BurnScheduleEntry,
  CommunityMilestone,
  DemonZenoQuote,
  MaintenanceMode,
  MarketMoodBanner,
  PushNotification,
  Signal,
  SignalOfWeekFull,
  SignalPerformanceStats,
  Testimonial,
  WhitepaperContent,
} from "../types";

// ─── Push Notifications ───────────────────────────────────────────────────
export function usePushNotifications(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<PushNotification[]>({
    queryKey: ["pushNotifications", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      const r = await actor.getActivePushNotifications();
      return r;
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 30_000,
  });

  const create = useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createPushNotification(title, body, sessionToken);
    },
    onSuccess: () => {
      toast.success("Push notification sent");
      qc.invalidateQueries({ queryKey: ["pushNotifications"] });
    },
    onError: () => toast.error("Failed to send notification"),
  });

  const dismiss = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.dismissPushNotification(id);
    },
    onSuccess: () => {
      toast.success("Notification dismissed");
      qc.invalidateQueries({ queryKey: ["pushNotifications"] });
    },
    onError: () => toast.error("Failed to dismiss notification"),
  });

  return { ...query, create, dismiss };
}

// ─── Signal Performance Stats ─────────────────────────────────────────────
export function useSignalPerformanceStats(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SignalPerformanceStats | null>({
    queryKey: ["signalPerformanceStats", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      const r = await actor.getSignalPerformanceStats(sessionToken);
      if (r.__kind__ === "ok") return r.ok;
      return null;
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 60_000,
  });
}

// ─── Market Mood Banner ───────────────────────────────────────────────────
export function useMarketMoodBanner(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<MarketMoodBanner | null>({
    queryKey: ["marketMoodBanner"],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getMarketMoodBanner();
      return r ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const set = useMutation({
    mutationFn: async ({
      mood,
      message,
    }: { mood: string; message: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.setMarketMoodBanner(mood, message, sessionToken);
    },
    onSuccess: () => {
      toast.success("Market mood banner updated");
      qc.invalidateQueries({ queryKey: ["marketMoodBanner"] });
    },
    onError: () => toast.error("Failed to update banner"),
  });

  return { ...query, set };
}

// ─── Maintenance Mode ─────────────────────────────────────────────────────
export function useMaintenanceMode(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<MaintenanceMode | null>({
    queryKey: ["maintenanceMode"],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getMaintenanceMode();
      return r ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const set = useMutation({
    mutationFn: async ({
      enabled,
      message,
    }: { enabled: boolean; message: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.setMaintenanceMode(enabled, message, sessionToken);
    },
    onSuccess: () => {
      toast.success("Maintenance mode updated");
      qc.invalidateQueries({ queryKey: ["maintenanceMode"] });
    },
    onError: () => toast.error("Failed to update maintenance mode"),
  });

  return { ...query, set };
}

// ─── Scheduled Signals ────────────────────────────────────────────────────
export function useScheduledSignalsEnhanced(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<Signal[]>({
    queryKey: ["scheduledSignalsEnhanced", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      const r = await actor.getScheduledSignals(sessionToken);
      if (r.__kind__ === "ok") return r.ok;
      return [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 30_000,
  });

  const publishAll = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.publishScheduledSignals();
    },
    onSuccess: (count) => {
      toast.success(`Published ${String(count)} signal(s)`);
      qc.invalidateQueries({ queryKey: ["scheduledSignalsEnhanced"] });
      qc.invalidateQueries({ queryKey: ["signals"] });
    },
    onError: () => toast.error("Failed to publish signals"),
  });

  return { ...query, publishAll };
}

// ─── A/B Tests ────────────────────────────────────────────────────────────
export function useAbTests(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<AbTest[]>({
    queryKey: ["abTests", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      const r = await actor.getAbTests(sessionToken);
      if (r.__kind__ === "ok") return r.ok;
      return [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 60_000,
  });

  const create = useMutation({
    mutationFn: async ({
      name,
      variantA,
      variantB,
    }: { name: string; variantA: string; variantB: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createAbTest(name, variantA, variantB, sessionToken);
    },
    onSuccess: () => {
      toast.success("A/B test created");
      qc.invalidateQueries({ queryKey: ["abTests"] });
    },
    onError: () => toast.error("Failed to create A/B test"),
  });

  const recordImpression = useMutation({
    mutationFn: async ({
      testId,
      variant,
    }: { testId: string; variant: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.recordAbImpression(testId, variant);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["abTests"] }),
  });

  return { ...query, create, recordImpression };
}

// ─── Audit Snapshots ──────────────────────────────────────────────────────
export function useAuditSnapshots(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<AuditSnapshot[]>({
    queryKey: ["auditSnapshots", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      const r = await actor.listAuditSnapshots(sessionToken);
      if (r.__kind__ === "ok") return r.ok;
      return [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 60_000,
  });

  const create = useMutation({
    mutationFn: async (snapshotLabel: string) => {
      if (!actor) throw new Error("No actor");
      return actor.createAuditSnapshot(snapshotLabel, sessionToken);
    },
    onSuccess: () => {
      toast.success("Audit snapshot created");
      qc.invalidateQueries({ queryKey: ["auditSnapshots"] });
    },
    onError: () => toast.error("Failed to create snapshot"),
  });

  return { ...query, create };
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────
export function useActivityHeatmap(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ActivityEntry[]>({
    queryKey: ["activityHeatmap", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return [];
      const r = await actor.getAdminActivityHeatmap(sessionToken);
      if (r.__kind__ === "ok") return r.ok;
      return [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 120_000,
  });
}

// ─── Community Content ────────────────────────────────────────────────────
export function useCommunityQuotes(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<DemonZenoQuote[]>({
    queryKey: ["communityQuotes"],
    queryFn: async () => {
      if (!actor) return [];
      const r = await actor.getQuotes();
      return r;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const add = useMutation({
    mutationFn: async ({
      quote,
      author,
    }: { quote: string; author: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addQuote(quote, author, sessionToken);
    },
    onSuccess: () => {
      toast.success("Quote added");
      qc.invalidateQueries({ queryKey: ["communityQuotes"] });
    },
    onError: () => toast.error("Failed to add quote"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteQuote(id, sessionToken);
    },
    onSuccess: () => {
      toast.success("Quote deleted");
      qc.invalidateQueries({ queryKey: ["communityQuotes"] });
    },
    onError: () => toast.error("Failed to delete quote"),
  });

  return { ...query, add, remove };
}

export function useCommunityTestimonials(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<Testimonial[]>({
    queryKey: ["communityTestimonials"],
    queryFn: async () => {
      if (!actor) return [];
      const r = await actor.getTestimonials();
      return r;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const add = useMutation({
    mutationFn: async ({
      name,
      content,
      winAmount,
      asset,
    }: {
      name: string;
      content: string;
      winAmount: string | null;
      asset: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addTestimonial(
        name,
        content,
        winAmount,
        asset,
        sessionToken,
      );
    },
    onSuccess: () => {
      toast.success("Testimonial added");
      qc.invalidateQueries({ queryKey: ["communityTestimonials"] });
    },
    onError: () => toast.error("Failed to add testimonial"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteTestimonial(id, sessionToken);
    },
    onSuccess: () => {
      toast.success("Testimonial deleted");
      qc.invalidateQueries({ queryKey: ["communityTestimonials"] });
    },
    onError: () => toast.error("Failed to delete testimonial"),
  });

  return { ...query, add, remove };
}

export function useSignalOfWeekAdmin(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<SignalOfWeekFull | null>({
    queryKey: ["signalOfWeek"],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getSignalOfWeek();
      return r ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const set = useMutation({
    mutationFn: async ({
      signalId,
      comment,
    }: { signalId: string; comment: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.setSignalOfWeek(signalId, comment, sessionToken);
    },
    onSuccess: () => {
      toast.success("Signal of the Week updated");
      qc.invalidateQueries({ queryKey: ["signalOfWeek"] });
    },
    onError: () => toast.error("Failed to update Signal of the Week"),
  });

  return { ...query, set };
}

export function useCommunityMilestones(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<CommunityMilestone[]>({
    queryKey: ["communityMilestones"],
    queryFn: async () => {
      if (!actor) return [];
      const r = await actor.getMilestones();
      return r;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const add = useMutation({
    mutationFn: async ({
      title,
      description,
    }: { title: string; description: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMilestone(title, description, sessionToken);
    },
    onSuccess: () => {
      toast.success("Milestone added");
      qc.invalidateQueries({ queryKey: ["communityMilestones"] });
    },
    onError: () => toast.error("Failed to add milestone"),
  });

  const markReached = useMutation({
    mutationFn: async ({
      id,
      celebrateDays,
    }: { id: string; celebrateDays: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.markMilestoneReached(id, celebrateDays, sessionToken);
    },
    onSuccess: () => {
      toast.success("Milestone marked as reached");
      qc.invalidateQueries({ queryKey: ["communityMilestones"] });
    },
    onError: () => toast.error("Failed to update milestone"),
  });

  return { ...query, add, markReached };
}

// ─── Token Launch Content ─────────────────────────────────────────────────
export function useWhitepaper(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<WhitepaperContent | null>({
    queryKey: ["whitepaper"],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getWhitepaper();
      return r ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });

  const update = useMutation({
    mutationFn: async (content: WhitepaperContent) => {
      if (!actor) throw new Error("No actor");
      return actor.updateWhitepaper(content, sessionToken);
    },
    onSuccess: () => {
      toast.success("Whitepaper updated");
      qc.invalidateQueries({ queryKey: ["whitepaper"] });
    },
    onError: () => toast.error("Failed to update whitepaper"),
  });

  return { ...query, update };
}

export function useBurnSchedule(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const query = useQuery<BurnScheduleEntry[]>({
    queryKey: ["burnSchedule"],
    queryFn: async () => {
      if (!actor) return [];
      const r = await actor.getBurnSchedule();
      return r;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const add = useMutation({
    mutationFn: async ({
      date,
      amount,
      reason,
    }: { date: string; amount: string; reason: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addBurnEntry(date, amount, reason, sessionToken);
    },
    onSuccess: () => {
      toast.success("Burn entry added");
      qc.invalidateQueries({ queryKey: ["burnSchedule"] });
    },
    onError: () => toast.error("Failed to add burn entry"),
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
      txHash,
    }: { id: string; status: string; txHash: string | null }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateBurnEntryStatus(id, status, txHash, sessionToken);
    },
    onSuccess: () => {
      toast.success("Burn entry updated");
      qc.invalidateQueries({ queryKey: ["burnSchedule"] });
    },
    onError: () => toast.error("Failed to update burn entry"),
  });

  return { ...query, add, updateStatus };
}

// ─── Admin Activity Logger ────────────────────────────────────────────────
export function useAdminActivity(sessionToken: string) {
  const { actor } = useActor(createActor);

  async function recordActivity(action: string) {
    if (!actor || !sessionToken) return;
    try {
      await actor.recordAdminActivity(action, sessionToken);
    } catch {
      // silently fail — logging should never block UI
    }
  }

  return { recordActivity };
}

// ─── Admin Role ───────────────────────────────────────────────────────────
export function useAdminRole(sessionToken: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string | null>({
    queryKey: ["adminRole", sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return null;
      const r = await actor.validateAdminRole(sessionToken);
      return r;
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 300_000,
  });
}
