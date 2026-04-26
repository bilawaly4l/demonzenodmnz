import { useEffect, useRef, useState } from "react";
import { useBurnTracker } from "../hooks/useBurnTracker";
import { ScrollAnimation } from "./ScrollAnimation";

// Animate a number counting up
function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
      else setValue(target);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}

function formatLargeNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// Simple CSS fire particles
function FireParticles() {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none"
      aria-hidden
    >
      {(["p0", "p1", "p2", "p3", "p4", "p5"] as const).map((k, i) => (
        <div
          key={k}
          className="absolute bottom-0 w-2 rounded-full animate-bounce"
          style={{
            left: `${10 + i * 14}%`,
            height: `${20 + (i % 3) * 14}px`,
            background: `oklch(${0.6 + i * 0.05} 0.22 ${22 + i * 15})`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${0.8 + i * 0.1}s`,
            opacity: 0.7 - i * 0.05,
          }}
        />
      ))}
    </div>
  );
}

export function TokenBurnTrackerSection() {
  const { data, isLoading } = useBurnTracker();
  const burned = data ? Number(data.totalBurned) : 0;
  const animatedValue = useCountUp(burned);

  // Display milestone: show progress bar up to 100M as a milestone
  const MILESTONE = 100_000_000;
  const progressPct =
    burned > 0 ? Math.min((burned / MILESTONE) * 100, 100) : 0;

  return (
    <section
      id="burn-tracker"
      data-ocid="burn_tracker.section"
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 100%, oklch(0.65 0.22 22 / 0.06), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest block mb-3">
              Token Burn
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Burn Tracker
            </h2>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 flex flex-col items-center gap-8 relative overflow-hidden">
            {/* Fire particles at bottom */}
            <div className="relative">
              <FireParticles />
            </div>

            {isLoading ? (
              <div
                data-ocid="burn_tracker.loading_state"
                className="flex flex-col items-center gap-3"
              >
                <div className="h-20 w-64 bg-muted/50 rounded-xl animate-pulse" />
                <div className="h-4 w-40 bg-muted/50 rounded animate-pulse" />
              </div>
            ) : burned === 0 ? (
              <div
                data-ocid="burn_tracker.empty_state"
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <div className="text-5xl">🔥</div>
                <p className="font-display font-bold text-foreground text-xl">
                  Burn tracker launches April 2, 2028
                </p>
                <p className="text-muted-foreground text-sm max-w-sm">
                  After the DMNZ token launches, the burn counter will track
                  every token removed from circulation in real-time.
                </p>
              </div>
            ) : (
              <>
                {/* Big number */}
                <div className="text-center">
                  <p
                    className="font-display font-black text-6xl md:text-8xl leading-none"
                    style={{ color: "oklch(0.72 0.18 195)" }}
                    data-ocid="burn_tracker.counter"
                  >
                    {formatLargeNumber(animatedValue)}
                  </p>
                  <p className="text-muted-foreground text-lg font-semibold mt-3 uppercase tracking-widest">
                    DMNZ Burned Since Launch
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>Milestone: {formatLargeNumber(MILESTONE)} DMNZ</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${progressPct}%`,
                        background:
                          "linear-gradient(90deg, oklch(0.65 0.15 190), oklch(0.65 0.22 22))",
                        boxShadow: "0 0 12px oklch(0.65 0.15 190 / 0.6)",
                      }}
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    {progressPct.toFixed(1)}% toward{" "}
                    {formatLargeNumber(MILESTONE)} milestone
                  </p>
                </div>

                {data?.lastUpdated ? (
                  <p className="text-xs text-muted-foreground/60">
                    Last updated:{" "}
                    {new Date(
                      Number(data.lastUpdated) / 1_000_000,
                    ).toLocaleString()}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
