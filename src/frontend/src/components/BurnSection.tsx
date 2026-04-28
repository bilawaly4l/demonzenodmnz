import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Flame, TrendingUp } from "lucide-react";
import { createActor } from "../backend";
import type { BurnEvent } from "../types";
import { CountdownTimer } from "./CountdownTimer";
import { ScrollAnimation } from "./ScrollAnimation";

function useBurnSchedule() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BurnEvent[]>({
    queryKey: ["burnSchedule"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTokenBurnSchedule();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

function useBurnTracker() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["burnTracker"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBurnTracker();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

const UPCOMING_BURNS = [
  {
    date: "April 2, 2028",
    amount: "Massive Buyback & Burn",
    desc: "Main launch event — reduces supply and triggers bonding curve.",
  },
  {
    date: "Post-2028",
    amount: "Scheduled Burns",
    desc: "Periodic burns based on community governance votes.",
  },
];

export function BurnSection() {
  const { data: burnSchedule = [] } = useBurnSchedule();
  const { data: burnTracker } = useBurnTracker();

  return (
    <section id="burn" data-ocid="burn.section" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl flex flex-col gap-12">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Burn Mechanics
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              DMNZ Burn Schedule
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Every burn reduces supply, increases scarcity, and drives price
              appreciation.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Burn countdown */}
          <ScrollAnimation direction="left">
            <div
              className="bg-card border rounded-2xl p-8 flex flex-col items-center gap-6 text-center card-elevated"
              style={{ borderColor: "oklch(0.55 0.22 25 / 0.3)" }}
            >
              <Flame
                className="w-12 h-12"
                style={{ color: "oklch(0.65 0.22 25)" }}
              />
              <div className="flex flex-col gap-2">
                <span
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  The Great Burn
                </span>
                <h3
                  className="font-display font-bold text-2xl"
                  style={{ color: "oklch(0.97 0.005 260)" }}
                >
                  🔥 Burn Event Countdown
                </h3>
                <p className="text-muted-foreground text-sm">
                  April 2, 2028 — Supply shrinks. Price ascends.
                </p>
              </div>
              <CountdownTimer />
              <div
                className="flex flex-col gap-2 rounded-xl px-5 py-4 border text-sm text-left w-full"
                style={{
                  background: "oklch(0.55 0.22 25 / 0.06)",
                  borderColor: "oklch(0.55 0.22 25 / 0.25)",
                }}
              >
                {[
                  "🔥 Permanently reduce circulating supply",
                  "📈 Create upward price pressure through scarcity",
                  "⚡ Trigger bonding curve → Exchange listings",
                ].map((r) => (
                  <p key={r} style={{ color: "oklch(0.78 0.01 260)" }}>
                    {r}
                  </p>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Burn tracker + schedule */}
          <ScrollAnimation direction="right">
            <div className="flex flex-col gap-5">
              {burnTracker && (
                <div
                  className="bg-card border rounded-2xl p-5 flex items-center gap-4 card-elevated"
                  style={{ borderColor: "oklch(0.55 0.22 25 / 0.3)" }}
                  data-ocid="burn_tracker.card"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.65 0.22 25 / 0.12)" }}
                  >
                    <Flame
                      className="w-6 h-6"
                      style={{ color: "oklch(0.65 0.22 25)" }}
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      DMNZ Burned (Running Total)
                    </p>
                    <p
                      className="font-display font-black text-2xl"
                      style={{ color: "oklch(0.65 0.22 25)" }}
                    >
                      {Number(burnTracker.totalBurned).toLocaleString()} DMNZ
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <h3 className="font-display font-bold text-foreground text-lg">
                  Burn Schedule
                </h3>
                {burnSchedule.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {burnSchedule.map((event, i) => (
                      <div
                        key={event.id ?? i}
                        data-ocid={`burn.schedule.item.${i + 1}`}
                        className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 card-elevated"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                          style={{
                            background: "oklch(0.55 0.22 25 / 0.1)",
                            color: "oklch(0.65 0.22 25)",
                          }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="font-display font-bold text-foreground text-sm">
                            {event.date}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {event.reason}
                          </p>
                          {event.amount && (
                            <span
                              className="text-xs font-mono font-semibold"
                              style={{ color: "oklch(0.65 0.22 25)" }}
                            >
                              {event.amount} DMNZ
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {UPCOMING_BURNS.map((burn, i) => (
                      <div
                        key={burn.date}
                        data-ocid={`burn.upcoming.item.${i + 1}`}
                        className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 card-elevated"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: "oklch(0.55 0.22 25 / 0.1)",
                            color: "oklch(0.65 0.22 25)",
                          }}
                        >
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <p className="font-display font-bold text-foreground text-sm">
                              {burn.amount}
                            </p>
                            <span className="text-xs font-mono text-muted-foreground">
                              {burn.date}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {burn.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
