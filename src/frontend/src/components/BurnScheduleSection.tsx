import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, ExternalLink, Flame } from "lucide-react";
import { createActor } from "../backend";
import type { BurnScheduleEntry } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

function usePublicBurnSchedule() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BurnScheduleEntry[]>({
    queryKey: ["publicBurnSchedule"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicBurnSchedule();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

const FALLBACK: BurnScheduleEntry[] = [
  {
    id: "1",
    status: "planned",
    date: "April 2, 2028",
    amount: "TBA — Massive Buyback",
    reason:
      "Initial Buyback & Burn — reduce supply, trigger bonding curve, and list on new exchanges.",
  },
  {
    id: "2",
    status: "planned",
    date: "Q3 2028",
    amount: "TBA",
    reason: "Community-voted burn event post-initial listing.",
  },
  {
    id: "3",
    status: "planned",
    date: "2029+",
    amount: "Ongoing",
    reason: "Periodic transaction-based burns from protocol revenue.",
  },
];

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status === "completed";
  return (
    <Badge
      className="font-semibold text-xs capitalize gap-1"
      style={{
        background: isCompleted
          ? "oklch(0.7 0.18 145 / 0.15)"
          : "oklch(0.65 0.15 190 / 0.12)",
        color: isCompleted ? "oklch(0.7 0.18 145)" : "oklch(0.65 0.15 190)",
        border: isCompleted
          ? "1px solid oklch(0.7 0.18 145 / 0.3)"
          : "1px solid oklch(0.65 0.15 190 / 0.3)",
      }}
    >
      {isCompleted ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      )}
      {status}
    </Badge>
  );
}

export function BurnScheduleSection() {
  const { data, isLoading } = usePublicBurnSchedule();
  const entries = data && data.length > 0 ? data : FALLBACK;

  return (
    <section
      id="burn-schedule"
      data-ocid="burn_schedule.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Burn Log
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Burn Schedule
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Every planned and completed burn event for DMNZ. Full
              transparency, no surprises.
            </p>
          </div>
        </ScrollAnimation>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((k) => (
              <Skeleton key={k} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div
            data-ocid="burn_schedule.empty_state"
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <Flame className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Burn schedule will be published before April 2, 2028.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border/50" />

            <div className="flex flex-col gap-5 pl-14">
              {entries.map((entry, i) => (
                <ScrollAnimation key={entry.id} delay={i * 80}>
                  <div
                    data-ocid={`burn_schedule.item.${i + 1}`}
                    className="relative bg-card border border-border rounded-2xl p-5 card-elevated"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[2.35rem] top-5 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10"
                      style={{
                        background:
                          entry.status === "completed"
                            ? "oklch(0.7 0.18 145)"
                            : "oklch(0.65 0.22 25 / 0.15)",
                        borderColor:
                          entry.status === "completed"
                            ? "oklch(0.7 0.18 145)"
                            : "oklch(0.65 0.22 25 / 0.4)",
                      }}
                    >
                      <Flame
                        className="w-4 h-4"
                        style={{
                          color:
                            entry.status === "completed"
                              ? "oklch(0.12 0.02 260)"
                              : "oklch(0.65 0.22 25)",
                        }}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                      <div>
                        <p className="font-display font-bold text-foreground text-sm">
                          {entry.date}
                        </p>
                        <p className="text-primary font-mono font-semibold text-sm mt-0.5">
                          {entry.amount}
                        </p>
                      </div>
                      <StatusBadge status={entry.status} />
                    </div>

                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {entry.reason}
                    </p>

                    {entry.txHash && (
                      <a
                        href={`https://explorer.blum.io/tx/${entry.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`burn_schedule.tx.link.${i + 1}`}
                        className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline w-fit"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Transaction
                      </a>
                    )}
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
