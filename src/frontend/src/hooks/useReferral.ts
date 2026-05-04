import { createActor } from "@/backend";
import type { Backend, Result_1 } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Extended backend for new methods not yet in generated bindings
interface ExtendedBackend extends Backend {
  getReferralStats(): Promise<
    Array<{
      referrerName: string;
      code: string;
      referralCount: bigint;
      createdAt: bigint;
    }>
  >;
  getMyReferrals(code: string): Promise<string[]>;
  createReferralLink(
    referrerName: string,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  trackReferral(
    code: string,
    refereeName: string,
  ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
}

function asExt(actor: Backend): ExtendedBackend {
  return actor as unknown as ExtendedBackend;
}

// --- Fetch referral stats (all referrers) ---

interface ReferralStatEntry {
  referrerName: string;
  code: string;
  referralCount: bigint;
  createdAt: bigint;
}

export function useGetReferralStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReferralStatEntry[]>({
    queryKey: ["referralStats"],
    queryFn: async () => {
      if (!actor) return [];
      return asExt(actor).getReferralStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// --- Fetch referees for a specific code ---

export function useGetMyReferrals(code: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string[]>({
    queryKey: ["myReferrals", code],
    queryFn: async () => {
      if (!actor || !code) return [];
      return asExt(actor).getMyReferrals(code);
    },
    enabled: !!actor && !isFetching && !!code,
    staleTime: 30_000,
  });
}

// --- Create a new referral link ---

export function useCreateReferralLink() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (referrerName: string): Promise<string> => {
      if (!actor) throw new Error("Actor not available");
      const result = await asExt(actor).createReferralLink(referrerName);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["referralStats"] });
    },
  });
}

// --- Track a referral (referees use a code) ---

export function useTrackReferral() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { code: string; refereeName: string }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await asExt(actor).trackReferral(
        vars.code,
        vars.refereeName,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["referralStats"] });
    },
  });
}
