import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Announcement } from "../types";

export function useAnnouncement() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Announcement | null>({
    queryKey: ["announcement"],
    queryFn: async () => {
      if (!actor) return null;
      const announcements = await actor.getAnnouncements();
      // Return first active pinned announcement, then first active, or null
      const pinned = announcements.find((a) => a.isActive && a.isPinned);
      if (pinned) return pinned;
      const active = announcements.find((a) => a.isActive);
      return active ?? null;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });
}
