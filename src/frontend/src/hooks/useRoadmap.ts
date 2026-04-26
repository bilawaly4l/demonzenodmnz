import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { RoadmapMilestone } from "../types";

export function useRoadmap() {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<RoadmapMilestone[]>({
    queryKey: ["roadmap"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoadmap();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    milestones: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? "Failed to load roadmap" : null,
  };
}
