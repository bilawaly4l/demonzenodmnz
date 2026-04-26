import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Circle, Trophy } from "lucide-react";
import { createActor } from "../backend";
import type { CommunityMilestone } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

function useMilestones() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CommunityMilestone[]>({
    queryKey: ["milestones"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMilestones();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

function isCelebrating(m: CommunityMilestone): boolean {
  if (!m.reached || !m.celebrateUntil) return false;
  return Date.now() < Number(m.celebrateUntil) / 1_000_000;
}

const FALLBACK: CommunityMilestone[] = [
  {
    id: "1",
    reached: false,
    title: "1,000 Followers on Binance Square",
    description: "The first major milestone on our journey to launch.",
  },
  {
    id: "2",
    reached: false,
    title: "5,000 Twitter Followers",
    description: "Growing the community across all platforms.",
  },
  {
    id: "3",
    reached: false,
    title: "DMNZ Token Launch on Blum",
    description: "April 2, 2028 — the day everything begins.",
  },
];

export function MilestonesSection() {
  const { data, isLoading } = useMilestones();
  const milestones = data && data.length > 0 ? data : FALLBACK;

  const celebrating = milestones.filter(isCelebrating);

  if (isLoading) return null;

  return (
    <section
      id="milestones"
      data-ocid="milestones.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Celebration banners */}
        {celebrating.map((m) => (
          <div
            key={m.id}
            data-ocid="milestones.celebrate.banner"
            className="mb-6 flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-5 py-4 animate-pulse-glow"
          >
            <Trophy className="w-5 h-5 text-primary shrink-0" />
            <p className="font-display font-bold text-primary text-sm">
              🎉 Milestone Reached: {m.title}
            </p>
          </div>
        ))}

        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Journey
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Community Milestones
            </h2>
            <p className="text-muted-foreground text-sm">
              Tracking the growth of the DemonZeno community.
            </p>
          </div>
        </ScrollAnimation>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border/60" />

          <div className="flex flex-col gap-6 pl-14">
            {milestones.map((m, i) => {
              const reached = m.reached;
              const celebrating = isCelebrating(m);
              return (
                <ScrollAnimation key={m.id} delay={i * 80}>
                  <div
                    data-ocid={`milestones.item.${i + 1}`}
                    className={`relative bg-card border rounded-2xl p-5 card-elevated transition-smooth ${celebrating ? "border-primary/50 shadow-primary/10 shadow-lg" : reached ? "border-primary/30" : "border-border"}`}
                  >
                    {/* Circle icon */}
                    <div
                      className="absolute -left-[2.35rem] top-5 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10"
                      style={{
                        background: reached
                          ? "oklch(0.65 0.15 190)"
                          : "var(--card)",
                        borderColor: reached
                          ? "oklch(0.65 0.15 190)"
                          : "var(--border)",
                      }}
                    >
                      {reached ? (
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3
                          className={`font-display font-bold text-base ${reached ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {m.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {m.description}
                        </p>
                        {m.reachedAt && reached && (
                          <span className="text-xs text-primary font-semibold mt-1">
                            Reached{" "}
                            {new Date(
                              Number(m.reachedAt) / 1_000_000,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {celebrating && (
                        <span className="shrink-0 text-lg">🎉</span>
                      )}
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
