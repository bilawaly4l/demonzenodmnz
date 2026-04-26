import { useEffect, useState } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

const LAUNCH_DATE = new Date("2028-04-02T00:00:00Z");
const START_DATE = new Date("2024-01-01T00:00:00Z");

function useLaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function calc() {
      const now = Date.now();
      const diff = Math.max(0, LAUNCH_DATE.getTime() - now);
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        mins: Math.floor((diff % 3_600_000) / 60_000),
        secs: Math.floor((diff % 60_000) / 1_000),
      });
      const total = LAUNCH_DATE.getTime() - START_DATE.getTime();
      const elapsed = now - START_DATE.getTime();
      setProgress(Math.min(100, Math.max(0, (elapsed / total) * 100)));
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return { timeLeft, progress };
}

const MILESTONES = [
  { label: "2026", pct: 33 },
  { label: "2027", pct: 66 },
  { label: "2028", pct: 100 },
];

function Pad({ n }: { n: number }) {
  return <>{String(n).padStart(2, "0")}</>;
}

export function HypeBarSection() {
  const { timeLeft, progress } = useLaunchCountdown();

  return (
    <section
      id="hype-bar"
      data-ocid="hype_bar.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Launch
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              DMNZ Hype is Building
            </h2>
            <p className="text-muted-foreground text-base">
              The journey to April 2, 2028. Every day brings us closer.
            </p>
          </div>
        </ScrollAnimation>

        {/* Countdown digits */}
        <ScrollAnimation delay={100}>
          <div
            data-ocid="hype_bar.countdown.display"
            className="flex justify-center gap-4 md:gap-8 mb-10"
          >
            {[
              { label: "Days", val: timeLeft.days },
              { label: "Hours", val: timeLeft.hours },
              { label: "Mins", val: timeLeft.mins },
              { label: "Secs", val: timeLeft.secs },
            ].map(({ label, val }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border border-primary/20 flex items-center justify-center font-display font-bold text-2xl md:text-3xl text-primary"
                  style={{ boxShadow: "0 0 20px oklch(0.65 0.15 190 / 0.15)" }}
                >
                  <Pad n={val} />
                </div>
                <span className="text-muted-foreground text-xs uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </ScrollAnimation>

        {/* Progress bar */}
        <ScrollAnimation delay={150}>
          <div
            data-ocid="hype_bar.progress.bar"
            className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 card-elevated"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-foreground text-sm">
                Journey Progress
              </span>
              <span className="font-mono text-primary font-bold text-sm">
                {progress.toFixed(1)}%
              </span>
            </div>

            {/* Bar with milestone markers */}
            <div className="relative">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145), oklch(0.68 0.2 160))",
                  }}
                />
              </div>
              {/* Milestone markers */}
              {MILESTONES.map(({ label, pct }) => (
                <div
                  key={label}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
                >
                  <div
                    className="w-0.5 h-4"
                    style={{
                      background:
                        progress >= pct
                          ? "oklch(0.7 0.18 145)"
                          : "var(--border)",
                    }}
                  />
                  <span
                    className="text-xs font-mono mt-2 font-semibold"
                    style={{
                      color:
                        progress >= pct
                          ? "oklch(0.65 0.15 190)"
                          : "var(--muted-foreground)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Milestone labels below */}
            <div className="grid grid-cols-3 text-xs text-muted-foreground pt-6">
              <span>Community Binance</span>
              <span className="text-center">DMNZ Launch</span>
              <span className="text-right">Buyback & Burn</span>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
