import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Analytics } from "../backend";

/**
 * Admin-only hook. Requires a valid sessionToken.
 * Falls back to empty analytics when not available.
 */
export function useAnalytics(sessionToken: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Analytics>({
    queryKey: ["analytics", sessionToken],
    queryFn: async (): Promise<Analytics> => {
      const empty: Analytics = {
        signalsByMarket: [],
        notifyMeByDate: [],
        totalNotifyMe: BigInt(0),
      };
      if (!actor || !sessionToken) return empty;
      const result = await actor.getAnalytics(sessionToken);
      if (result.__kind__ === "ok") return result.ok;
      return empty;
    },
    enabled: !!actor && !isFetching && !!sessionToken,
    staleTime: 60_000,
  });
}
