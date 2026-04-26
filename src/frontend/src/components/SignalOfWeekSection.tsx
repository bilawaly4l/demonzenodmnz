import { Badge } from "@/components/ui/badge";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Award, TrendingDown, TrendingUp } from "lucide-react";
import { createActor } from "../backend";
import type { SignalOfWeekFull } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

function useSignalOfWeek() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SignalOfWeekFull | null>({
    queryKey: ["signalOfWeek"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSignalOfWeek();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

export function SignalOfWeekSection() {
  const { data: sotw, isLoading } = useSignalOfWeek();

  if (isLoading) return null;
  if (!sotw) return null;

  const { signal, comment, weekOf } = sotw;
  const isBuy = signal.direction === "Buy";

  return (
    <section
      id="signal-of-week"
      data-ocid="signal_of_week.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Feature
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Signal of the Week
            </h2>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div
            data-ocid="signal_of_week.card"
            className="relative bg-card border-2 rounded-2xl p-8 overflow-hidden"
            style={{
              borderColor: "oklch(0.65 0.15 190 / 0.5)",
              boxShadow: "0 0 40px oklch(0.65 0.15 190 / 0.12)",
            }}
          >
            {/* Top accent */}
            <div
              className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145))",
              }}
            />

            {/* SOTW badge + week label */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-primary text-xs font-bold uppercase tracking-widest block">
                    Signal of the Week
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Week of {weekOf}
                  </span>
                </div>
              </div>
              <Badge
                className="font-semibold"
                style={{
                  background: isBuy
                    ? "oklch(0.7 0.18 145 / 0.15)"
                    : "oklch(0.55 0.22 25 / 0.15)",
                  color: isBuy ? "oklch(0.7 0.18 145)" : "oklch(0.65 0.22 25)",
                  border: `1px solid ${isBuy ? "oklch(0.7 0.18 145 / 0.3)" : "oklch(0.55 0.22 25 / 0.3)"}`,
                }}
              >
                {isBuy ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {signal.direction}
              </Badge>
            </div>

            {/* Signal details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                ["Asset", signal.asset],
                ["Entry", signal.entryPrice || "—"],
                ["Stop Loss", signal.stopLoss || "—"],
                ["Confidence", signal.confidence],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-background/60 rounded-xl px-4 py-3 flex flex-col gap-1"
                >
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="font-display font-bold text-foreground text-sm">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Take Profit targets */}
            {signal.targetPrice && (
              <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 mb-5 flex flex-col gap-2">
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  Take Profit Targets
                </span>
                <p className="text-foreground text-sm font-mono">
                  {signal.targetPrice}
                </p>
              </div>
            )}

            {/* Admin comment */}
            {comment && (
              <div className="bg-muted/40 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  DemonZeno's Take
                </span>
                <p className="text-foreground text-sm leading-relaxed">
                  {comment}
                </p>
              </div>
            )}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
