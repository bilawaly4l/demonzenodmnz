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
      return actor.getAnnouncement();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });
}
