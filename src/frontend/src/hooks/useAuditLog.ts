import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { AuditEntry } from "../backend";

/**
 * Admin-only hook. Requires a valid sessionToken.
 * Returns audit log entries sorted newest first.
 */
export function useAuditLog(sessionToken: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<AuditEntry[]>({
    queryKey: ["auditLog", sessionToken],
    queryFn: async (): Promise<AuditEntry[]> => {
      if (!actor || !sessionToken) return [];
      const result = await actor.getAuditLog(sessionToken);
      if (result.__kind__ === "ok") return result.ok;
      return [];
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 30_000,
  });
}
